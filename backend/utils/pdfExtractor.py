import sys
import fitz  # PyMuPDF

def extract_pdf_clean(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        # Using "text" mode in PyMuPDF is extremely robust for preserving 
        # horizontal spaces, block layouts, and standard tables.
        text += page.get_text("text") + "\n\n"
    return text

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    if len(sys.argv) < 2:
        print("Usage: python pdfExtractor.py <file_path>", file=sys.stderr)
        sys.exit(1)
        
    try:
        content = extract_pdf_clean(sys.argv[1])
        print(content)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
