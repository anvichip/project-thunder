# pdf_generator.py - Convert HTML resume to PDF
import os
from weasyprint import HTML, CSS
from io import BytesIO
import tempfile

def html_to_pdf(html_content: str, css_content: str = '') -> bytes:
    """
    Convert HTML resume to PDF
    
    Args:
        html_content: HTML string
        css_content: CSS string (optional)
        
    Returns:
        PDF bytes
    """
    print("📄 Converting HTML to PDF...")
    
    try:
        # Create complete HTML with embedded CSS
        if css_content:
            full_html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
    {css_content}
    
    /* Print optimization */
    @page {{
        size: A4;
        margin: 2cm;
    }}
    
    body {{
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }}
    </style>
</head>
<body>
{extract_body_content(html_content)}
</body>
</html>
"""
        else:
            full_html = html_content
        
        # Convert to PDF using WeasyPrint
        html_doc = HTML(string=full_html)
        pdf_bytes = html_doc.write_pdf()
        
        print(f"✅ PDF generated successfully ({len(pdf_bytes)} bytes)")
        return pdf_bytes
        
    except Exception as e:
        print(f"❌ PDF generation failed: {e}")
        raise

def extract_body_content(html: str) -> str:
    """Extract content from body tag"""
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html, 'html.parser')
    body = soup.find('body')
    
    if body:
        return str(body)[6:-7]  # Remove <body> tags
    return html

def save_pdf_to_file(pdf_bytes: bytes, output_path: str) -> str:
    """
    Save PDF bytes to file
    
    Args:
        pdf_bytes: PDF data
        output_path: Output file path
        
    Returns:
        Path to saved file
    """
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'wb') as f:
            f.write(pdf_bytes)
        
        print(f"✅ PDF saved to: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"❌ Failed to save PDF: {e}")
        raise

# Alternative using Playwright (if WeasyPrint not available)
async def html_to_pdf_playwright(html_content: str) -> bytes:
    """
    Convert HTML to PDF using Playwright (browser-based)
    
    Args:
        html_content: HTML string
        
    Returns:
        PDF bytes
    """
    from playwright.async_api import async_playwright
    
    print("📄 Converting HTML to PDF using Playwright...")
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Set content
            await page.set_content(html_content)
            
            # Generate PDF
            pdf_bytes = await page.pdf(
                format='A4',
                print_background=True,
                margin={
                    'top': '2cm',
                    'right': '2cm',
                    'bottom': '2cm',
                    'left': '2cm'
                }
            )
            
            await browser.close()
            
            print(f"✅ PDF generated successfully ({len(pdf_bytes)} bytes)")
            return pdf_bytes
            
    except Exception as e:
        print(f"❌ PDF generation failed: {e}")
        raise