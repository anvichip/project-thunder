# latex_compiler.py
import os
import subprocess
import tempfile
import shutil
from datetime import datetime

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def compile_latex_to_pdf(latex_content: str, user_email: str) -> str:
    """
    Compile LaTeX content to PDF
    
    Args:
        latex_content: LaTeX source code
        user_email: User's email for naming output file
        
    Returns:
        Path to compiled PDF file
        
    Raises:
        Exception: If compilation fails
    """
    # Create temporary directory for compilation
    with tempfile.TemporaryDirectory() as temp_dir:
        # Write LaTeX content to file
        tex_file = os.path.join(temp_dir, "resume.tex")
        with open(tex_file, 'w', encoding='utf-8') as f:
            f.write(latex_content)
        
        try:
            # Compile LaTeX to PDF using pdflatex
            # Run twice to resolve references
            for _ in range(2):
                result = subprocess.run(
                    ['pdflatex', '-interaction=nonstopmode', '-output-directory', temp_dir, tex_file],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
            
            # Check if PDF was generated
            pdf_file = os.path.join(temp_dir, "resume.pdf")
            if not os.path.exists(pdf_file):
                # Parse error log
                log_file = os.path.join(temp_dir, "resume.log")
                error_msg = "Compilation failed"
                if os.path.exists(log_file):
                    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                        log_content = f.read()
                        # Extract error lines
                        error_lines = [line for line in log_content.split('\n') if '!' in line or 'Error' in line]
                        if error_lines:
                            error_msg = '\n'.join(error_lines[:5])
                raise Exception(error_msg)
            
            # Move PDF to output directory
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"resume_{user_email.split('@')[0]}_{timestamp}.pdf"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            shutil.copy(pdf_file, output_path)
            
            return output_path
            
        except subprocess.TimeoutExpired:
            raise Exception("LaTeX compilation timed out")
        except Exception as e:
            raise Exception(f"LaTeX compilation error: {str(e)}")


def validate_latex_syntax(latex_content: str) -> tuple[bool, str]:
    """
    Validate LaTeX syntax without full compilation
    
    Args:
        latex_content: LaTeX source code
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Basic syntax checks
    required_commands = ['\\documentclass', '\\begin{document}', '\\end{document}']
    
    for cmd in required_commands:
        if cmd not in latex_content:
            return False, f"Missing required command: {cmd}"
    
    # Check for balanced braces
    open_braces = latex_content.count('{')
    close_braces = latex_content.count('}')
    if open_braces != close_braces:
        return False, f"Unbalanced braces: {open_braces} open, {close_braces} close"
    
    # Check for balanced environments
    begin_count = latex_content.count('\\begin{')
    end_count = latex_content.count('\\end{')
    if begin_count != end_count:
        return False, f"Unbalanced environments: {begin_count} begin, {end_count} end"
    
    return True, "Syntax appears valid"


def get_latex_error_hints(error_message: str) -> str:
    """
    Provide helpful hints for common LaTeX errors
    
    Args:
        error_message: Error message from LaTeX compiler
        
    Returns:
        Helpful hint string
    """
    hints = {
        'Undefined control sequence': 'Check for typos in command names or missing packages',
        'Missing $ inserted': 'Mathematical content must be enclosed in $ signs',
        'Extra alignment tab': 'Too many & symbols in table or align environment',
        'Illegal parameter': 'Check for special characters that need escaping: # $ % & _ { }',
        'File not found': 'Check file paths and make sure referenced files exist',
        'Missing \\begin{document}': 'Document content must be inside \\begin{document}...\\end{document}',
    }
    
    for error_pattern, hint in hints.items():
        if error_pattern.lower() in error_message.lower():
            return hint
    
    return 'Check LaTeX syntax and consult documentation'