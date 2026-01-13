import pymupdf4llm
import mammoth
from pathlib import Path

def parse_pdf_to_md(pdf_path: str):
    """
    Converts PDF to Markdown-like text.
    """
    md_text = pymupdf4llm.to_markdown(pdf_path)
    return md_text

def parse_docx_to_md(docx_path: str) -> str:
    """
    Converts DOCX to Markdown-like text.
    """
    with open(docx_path, "rb") as docx_file:
        result = mammoth.convert_to_markdown(docx_file)
        md = result.value
    return md

def load_resume(file_path: str) -> str:
    """
    Loads resume from common formats and returns text (Markdown-ish).
    """
    path = Path(file_path)
    ext = path.suffix.lower()

    if ext == ".pdf":
        return parse_pdf_to_md(file_path)

    elif ext == ".docx":
        return parse_docx_to_md(file_path)

    elif ext in [".txt", ".md"]:
        return path.read_text(encoding="utf-8", errors="ignore")

    else:
        raise ValueError(f"Unsupported file extension: {ext}")