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


def pdf_to_html(pdf_path: str, output_html: str, refine_with_llm=True, mode="text-only"):
    """
    Convert PDF to HTML.
    
    mode options:
    - "text-only": Only render text with proper formatting - RECOMMENDED
    - "image-only": Only render the page as an image
    - "positioned": Render text with absolute positioning (maintains exact layout)
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
body { 
    margin: 0; 
    padding: 20px; 
    background: #f0f0f0; 
    font-family: Arial, sans-serif;
}
.page { 
    position: relative; 
    margin: 20px auto; 
    padding: 40px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-width: 800px;
}
.text-positioned { 
    position: absolute; 
    white-space: pre;
    color: #000;
}
.text-flow {
    margin-bottom: 8px;
    line-height: 1.4;
}
.text-flow.large {
    font-size: 18px;
    font-weight: bold;
    margin-top: 16px;
}
.text-flow.medium {
    font-size: 14px;
    font-weight: bold;
    margin-top: 12px;
}
a {
    color: #0066cc;
    text-decoration: underline;
}
a:hover {
    color: #0052a3;
}
</style>
</head>
<body>
"""

    with pdfplumber.open(pdf_path) as pdf:
        print(f"📄 Total Pages: {len(pdf.pages)}")

        for page_index, page in enumerate(pdf.pages):
            print(f"➡ Extracting page {page_index + 1}…")

            width = int(page.width)
            height = int(page.height)

            if mode == "text-only":
                # Extract text with better formatting
                html_out += f'<div class="page">'
                
                # Extract text and try to preserve structure
                text = page.extract_text()
                
                if text:
                    # Split into lines and process
                    lines = text.split('\n')
                    for line in lines:
                        line = line.strip()
                        if not line:
                            continue
                        
                        # Escape HTML
                        line_escaped = html.escape(line)
                        
                        # Make links clickable
                        line_with_links = make_links_clickable(line_escaped)
                        
                        # Determine text size based on heuristics
                        css_class = "text-flow"
                        if len(line) < 50 and line[0].isupper():
                            # Likely a header
                            css_class = "text-flow medium"
                        
                        html_out += f'<div class="{css_class}">{line_with_links}</div>\n'
                else:
                    html_out += '<p style="color: #999;">No text found on this page</p>'
                
                html_out += "</div>"
                
            elif mode == "positioned":
                # Positioned text mode (maintains exact layout)
                html_out += f'<div class="page" style="width:{width}px; height:{height}px;">'
                
                words = page.extract_words()
                print(f"   🔍 Words extracted: {len(words)}")

                if len(words) == 0:
                    print("   ⚠️ No words found! Falling back to CHAR-LEVEL extraction.")
                    chars = page.chars
                    print(f"   🔍 Chars extracted: {len(chars)}")

                    for c in chars:
                        x = c.get("x") or c.get("x0")
                        y = c.get("y") or c.get("top")
                        text = c.get("text", "")

                        if not x or not y or not text:
                            continue

                        text_escaped = html.escape(text)
                        text_with_links = make_links_clickable(text_escaped)

                        html_out += f'<div class="text-positioned" style="left:{float(x)}px; top:{float(y)}px; font-size:12px;">{text_with_links}</div>\n'
                else:
                    # Group words by line for better link detection
                    current_line = []
                    current_y = None
                    
                    for w in words:
                        x = float(w["x0"])
                        y = float(w["top"])
                        text = w["text"]
                        font_size = float(w.get("size", 12))
                        
                        # Check if this is a new line (y position changed significantly)
                        if current_y is None or abs(y - current_y) > 2:
                            # Process previous line
                            if current_line:
                                line_text = " ".join([word["text"] for word in current_line])
                                line_text_escaped = html.escape(line_text)
                                line_text_with_links = make_links_clickable(line_text_escaped)
                                
                                first_word = current_line[0]
                                html_out += f'<div class="text-positioned" style="left:{first_word["x"]}px; top:{first_word["y"]}px; font-size:{first_word["size"]}px;">{line_text_with_links}</div>\n'
                            
                            # Start new line
                            current_line = [{"text": text, "x": x, "y": y, "size": font_size}]
                            current_y = y
                        else:
                            # Continue current line
                            current_line.append({"text": text, "x": x, "y": y, "size": font_size})
                    
                    # Process last line
                    if current_line:
                        line_text = " ".join([word["text"] for word in current_line])
                        line_text_escaped = html.escape(line_text)
                        line_text_with_links = make_links_clickable(line_text_escaped)
                        
                        first_word = current_line[0]
                        html_out += f'<div class="text-positioned" style="left:{first_word["x"]}px; top:{first_word["y"]}px; font-size:{first_word["size"]}px;">{line_text_with_links}</div>\n'

                html_out += "</div>"
                
            elif mode == "image-only":
                html_out += f'<div class="page" style="width:{width}px; height:{height}px;">'
                
                page_image = page.to_image(resolution=150).original
                buffer = io.BytesIO()
                page_image.save(buffer, format="PNG")
                img_data = base64.b64encode(buffer.getvalue()).decode()

                html_out += f'<img src="data:image/png;base64,{img_data}" style="width:100%; height:auto;">'
                html_out += "</div>"

    html_out += "</body></html>"

    print("🧩 Extracted HTML successfully.")

    # LLM refinement (optional - may not be needed with better extraction)
    if refine_with_llm:
        print("🤖 Calling Ollama to refine HTML…")
        html_out = refine_html_with_llm(html_out)

    # WRITE FILE SAFELY
    print("💾 Saving output.html…")
    with open(output_html, "w", encoding="utf-8") as f:
        f.write(html_out)

    print("✅ DONE: output.html is generated!")

if __name__ == "__main__":
    # RECOMMENDED: Use "text-only" mode for readable, flowing text with clickable links
    # pdf_to_html("resume.pdf", "output.html", refine_with_llm=True, mode="text-only")
    
    # Alternative: Use "positioned" mode to maintain exact PDF layout with clickable links
    pdf_to_html("resume.pdf", "output.html", refine_with_llm=True, mode="positioned")
    
    # Alternative: Image only
    # pdf_to_html("resume.pdf", "output.html", refine_with_llm=False, mode="image-only")