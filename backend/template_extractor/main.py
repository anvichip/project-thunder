import pdfplumber
from PIL import Image
import base64
import io
import html
import os
import requests
import re

def refine_html_with_llm(raw_html: str) -> str:
    prompt = f"""
Clean the HTML but DO NOT REMOVE ANY CONTENT.
Do NOT output empty HTML.
Return ONLY valid HTML.

HTML INPUT:
{raw_html}
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.1",
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        if response.status_code != 200:
            print("⚠️ Ollama API returned non-200 response:", response.text)
            return raw_html

        data = response.json()
        output = data.get("response", "").strip()

        if len(output) < 50:
            print("⚠️ Ollama returned very short output. Keeping original HTML.")
            return raw_html

        return output

    except requests.exceptions.RequestException as e:
        print("⚠️ Error connecting to Ollama:", e)
        return raw_html


def make_links_clickable(text):
    """Convert URLs and email addresses to clickable links"""
    # Email pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    text = re.sub(email_pattern, r'<a href="mailto:\g<0>" style="color: blue; text-decoration: underline;">\g<0></a>', text)
    
    # URL pattern
    url_pattern = r'(https?://[^\s<>"]+|www\.[^\s<>"]+)'
    text = re.sub(url_pattern, r'<a href="\g<0>" target="_blank" style="color: blue; text-decoration: underline;">\g<0></a>', text)
    
    return text


def is_bold_font(font_name):
    """Determine if font is bold based on font name"""
    if not font_name:
        return False
    
    font_lower = font_name.lower()
    bold_indicators = ['bold', 'heavy', 'black', 'semibold', 'demibold', '-b', 'bd']
    
    return any(indicator in font_lower for indicator in bold_indicators)


def is_italic_font(font_name):
    """Determine if font is italic based on font name"""
    if not font_name:
        return False
    
    font_lower = font_name.lower()
    return 'italic' in font_lower or 'oblique' in font_lower or '-i' in font_lower


def pdf_to_html(pdf_path: str, output_html: str, refine_with_llm=False, scale_factor=1.0):
    """
    Convert PDF to HTML with exact formatting preservation.
    
    Args:
        pdf_path: Path to input PDF
        output_html: Path to output HTML file
        refine_with_llm: Whether to use LLM for refinement
        scale_factor: Scale factor for output (1.0 = original size)
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"❌ PDF not found: {pdf_path}")

    print("📄 Opening PDF…")

    html_out = """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body { 
    margin: 0; 
    padding: 20px; 
    background: #e0e0e0; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}
.page { 
    position: relative; 
    margin: 20px auto; 
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    page-break-after: always;
}
.word { 
    position: absolute; 
    white-space: nowrap;
    color: #000;
}
a {
    color: #0066cc;
    text-decoration: underline;
}
a:hover {
    color: #004499;
}
@media print {
    body {
        background: white;
        padding: 0;
    }
    .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
    }
}
</style>
</head>
<body>
"""

    with pdfplumber.open(pdf_path) as pdf:
        print(f"📄 Total Pages: {len(pdf.pages)}")

        for page_index, page in enumerate(pdf.pages):
            print(f"➡ Extracting page {page_index + 1}…")

            # Get page dimensions
            width = float(page.width) * scale_factor
            height = float(page.height) * scale_factor

            html_out += f'<div class="page" style="width:{width}px; height:{height}px;">\n'
            
            # Extract words with positioning and formatting
            words = page.extract_words(
                x_tolerance=3,
                y_tolerance=3,
                keep_blank_chars=True,
                use_text_flow=False,
                extra_attrs=['fontname', 'size']
            )
            
            print(f"   🔍 Words extracted: {len(words)}")

            if len(words) == 0:
                html_out += '<p style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:14px;">No text found on this page</p>\n'
            else:
                for word in words:
                    text = word.get('text', '')
                    x0 = float(word.get('x0', 0)) * scale_factor
                    top = float(word.get('top', 0)) * scale_factor
                    font_size = float(word.get('size', 12)) * scale_factor
                    font_name = word.get('fontname', '')
                    
                    # Skip empty words
                    if not text.strip():
                        continue
                    
                    # Escape HTML and make links clickable
                    text_escaped = html.escape(text)
                    text_with_links = make_links_clickable(text_escaped)
                    
                    # Determine font styling
                    font_weight = 'bold' if is_bold_font(font_name) else 'normal'
                    font_style = 'italic' if is_italic_font(font_name) else 'normal'
                    
                    # Build inline style
                    style = f"left:{x0:.2f}px; top:{top:.2f}px; font-size:{font_size:.2f}px; font-weight:{font_weight}; font-style:{font_style};"
                    
                    html_out += f'<span class="word" style="{style}">{text_with_links}</span>\n'

            html_out += "</div>\n"

    html_out += "</body></html>"

    print("🧩 Extracted HTML successfully.")

    # LLM refinement (optional - usually not needed)
    if refine_with_llm:
        print("🤖 Calling Ollama to refine HTML…")
        html_out = refine_html_with_llm(html_out)

    # Write output file
    print("💾 Saving output.html…")
    with open(output_html, "w", encoding="utf-8") as f:
        f.write(html_out)

    print("✅ DONE: output.html is generated!")
    print(f"📍 File saved to: {os.path.abspath(output_html)}")


if __name__ == "__main__":
    # Main conversion - preserves exact layout and formatting
    pdf_to_html(
        pdf_path="resume.pdf",
        output_html="output.html",
        refine_with_llm=True,
        scale_factor=1.5  # Adjust if needed (e.g., 1.5 for 150% size)
    )