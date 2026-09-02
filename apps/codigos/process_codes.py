import os
import re
import json
from pathlib import Path
from pypdf import PdfReader

def clean_text(text: str) -> str:
    # PDFs frequently split a word as "facul - tad" or "facul-\ntad".
    # Join only a hyphen surrounded by whitespace/a line break, leaving real
    # punctuation and numbered lists intact.
    text = re.sub(r'(\w)\s*-\s*(?:\n\s*)?(\w)', r'\1\2', text)
    text = re.sub(r'\s*\n\s*', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip(' -–—')

def process_ccyc(pdf_path: str):
    print("Processing CCyC...")
    reader = PdfReader(pdf_path)
    pages = []
    # Page 46 of this edition begins Annex I, the actual CCyC. Earlier pages
    # are the enacting law and its amendments, not code articles.
    for i in range(45, len(reader.pages)):
        t = reader.pages[i].extract_text() or ""
        lines = t.split("\n")
        cleaned_lines = []
        for line in lines:
            if any(h in line for h in ["Ediciones SAIJ", "Ministerio de Justicia", "Código Civil y Comercial de la Nación"]):
                continue
            cleaned_lines.append(line)
        pages.append("\n".join(cleaned_lines))
    
    full_text = "\n".join(pages)
    
    pattern = re.compile(
        r"(?:Artículo|ARTÍCULO)\s+(\d+)[°\.\s]+(?:([A-ZÁÉÍÓÚÑ][^\n\.\:\;]{2,70})[\.\:\;]\s*)?(.*?)(?=(?:Artículo|ARTÍCULO)\s+\d+[°\.\s]+|\Z)",
        re.DOTALL
    )
    
    articles = {}
    for m in pattern.finditer(full_text):
        num_str = m.group(1)
        num = int(num_str)
        title = (m.group(2) or "").strip()
        body = clean_text(m.group(3))
        
        if not title:
            title = f"Artículo {num}"
            
        if len(body) > 10 and num <= 2700:
            # The publication later reproduces amended provisions from other
            # laws. The first occurrence belongs to the CCyC itself.
            if num not in articles:
                articles[num] = {
                    "id": f"ccyc-{num}",
                    "code": "CCyC",
                    "codeName": "Código Civil y Comercial",
                    "number": str(num),
                    "title": title,
                    "text": body
                }
                
    result = [articles[k] for k in sorted(articles.keys())]
    print(f"CCyC extracted: {len(result)} articles (expected ~2671)")
    return result

def process_cpen(pdf_path: str):
    print("Processing CPen...")
    reader = PdfReader(pdf_path)
    pages = []
    for i in range(1, len(reader.pages)):
        pages.append(reader.pages[i].extract_text() or "")
    full_text = "\n".join(pages)
    
    pattern = re.compile(
        r"(?:ARTICULO|Artículo)\s+(\d+(?:\s*(?:bis|ter|quater|quinquies))?)[º\.\s\-\:]+(.*?)(?=(?:ARTICULO|Artículo)\s+\d+(?:\s*(?:bis|ter|quater|quinquies))?[º\.\s\-\:]+|\Z)",
        re.DOTALL
    )
    
    articles = {}
    for m in pattern.finditer(full_text):
        num_str = m.group(1).strip()
        body = clean_text(m.group(2))
        
        if len(body) > 10:
            clean_id = "cpen-" + num_str.replace(" ", "-")
            if num_str not in articles or len(body) > len(articles[num_str]["text"]):
                articles[num_str] = {
                    "id": clean_id,
                    "code": "CPen",
                    "codeName": "Código Penal de la Nación",
                    "number": num_str,
                    "title": f"Artículo {num_str}",
                    "text": body
                }
                
    result = list(articles.values())
    print(f"CPen extracted: {len(result)} articles")
    return result

def process_ccom(pdf_path: str):
    print("Processing CCom...")
    reader = PdfReader(pdf_path)
    pages = []
    for i in range(10, len(reader.pages)):
        pages.append(reader.pages[i].extract_text() or "")
    full_text = "\n".join(pages)
    
    pattern = re.compile(
        r"(?:^|\n)\s*(?:Art[ií]culo|Art|Akt|A\?r|Aet)\.?\s*(\d+)[°\.\"\s\:\-]+([^\n]+(?:\n[^\n]+){1,15})",
        re.IGNORECASE
    )
    
    articles = {}
    for m in pattern.finditer(full_text):
        num_str = m.group(1).strip()
        num = int(num_str)
        body = clean_text(m.group(2))
        
        if len(body) > 20 and 1 <= num <= 1500:
            if num not in articles or len(body) > len(articles[num]["text"]):
                articles[num] = {
                    "id": f"ccom-{num}",
                    "code": "CCom",
                    "codeName": "Código de Comercio",
                    "number": str(num),
                    "title": f"Artículo {num}",
                    "text": body,
                    "isRepealed": True
                }
                
    result = [articles[k] for k in sorted(articles.keys())]
    print(f"CCom extracted: {len(result)} articles")
    return result

def process_ccvs(pdf_path: str):
    print("Processing Código Civil de Vélez Sarsfield...")
    reader = PdfReader(pdf_path)
    pages = []
    for page in reader.pages:
        text = page.extract_text() or ""
        # Remove the repeated page heading and page number, while preserving
        # article content and its original line breaks for the parser.
        text = re.sub(r'^Código Civil de la República Argentina\s+\d+\s*$', '', text, flags=re.MULTILINE)
        pages.append(text)
    full_text = "\n".join(pages)

    pattern = re.compile(
        r'(?:^|\n)\s*Art\.\s*(\d+)\.\-\s*(.*?)(?=(?:^|\n)\s*Art\.\s*\d+\.\-|\Z)',
        re.IGNORECASE | re.DOTALL,
    )
    articles = {}
    for match in pattern.finditer(full_text):
        number = int(match.group(1))
        body = clean_text(match.group(2))
        if len(body) > 10 and 1 <= number <= 5000:
            # Keep the first full version: later repetitions often are notes or
            # the original wording after a reform.
            articles.setdefault(number, {
                "id": f"ccvs-{number}",
                "code": "CCVS",
                "codeName": "Código Civil de Vélez Sarsfield",
                "number": str(number),
                "title": f"Artículo {number}",
                "text": body,
                "isRepealed": True,
            })
    result = [articles[key] for key in sorted(articles)]
    print(f"CCVS extracted: {len(result)} articles")
    return result

def main():
    app_dir = Path(__file__).resolve().parent
    pdf_dir = app_dir / "pdfs"
    ccyc_file = pdf_dir / "codigo_civil_y_comercial_2024.pdf"
    cpen_file = pdf_dir / "CODIGO PENAL DE LA NACION ARGENTINA.pdf"
    ccom_file = pdf_dir / "Codigo de Comercio.pdf"
    ccvs_file = next(pdf_dir.glob("*V*lez*Sarsfield.pdf"))
    
    ccyc = process_ccyc(ccyc_file)
    cpen = process_cpen(cpen_file)
    ccom = process_ccom(ccom_file)
    ccvs = process_ccvs(ccvs_file)
    
    all_articles = ccyc + cpen + ccom + ccvs
    print(f"Total articles extracted across all 4 codes: {len(all_articles)}")
    
    output_dir = app_dir / "data"
    output_dir.mkdir(exist_ok=True)
    
    output_path = output_dir / "articles.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(all_articles)} articles to {output_path} ({os.path.getsize(output_path)} bytes)")

    compact_path = output_dir / "articles.min.json"
    with open(compact_path, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, separators=(',', ':'))
    print(f"Saved compact version to {compact_path} ({os.path.getsize(compact_path)} bytes)")

if __name__ == "__main__":
    main()
