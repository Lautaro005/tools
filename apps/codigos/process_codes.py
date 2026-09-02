import os
import re
import json
from pypdf import PdfReader

def clean_text(text: str) -> str:
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)
    text = re.sub(r'\s*\n\s*', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def process_ccyc(pdf_path: str):
    print("Processing CCyC...")
    reader = PdfReader(pdf_path)
    pages = []
    for i in range(41, len(reader.pages)):
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
            if num not in articles or len(body) > len(articles[num]["text"]):
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
                    "text": body
                }
                
    result = [articles[k] for k in sorted(articles.keys())]
    print(f"CCom extracted: {len(result)} articles")
    return result

def main():
    ccyc_file = "codigo_civil_y_comercial_2024.pdf"
    cpen_file = "CODIGO PENAL DE LA NACION ARGENTINA.pdf"
    ccom_file = "Codigo de Comercio.pdf"
    
    ccyc = process_ccyc(ccyc_file)
    cpen = process_cpen(cpen_file)
    ccom = process_ccom(ccom_file)
    
    all_articles = ccyc + cpen + ccom
    print(f"Total articles extracted across all 3 codes: {len(all_articles)}")
    
    os.makedirs("public/data", exist_ok=True)
    os.makedirs("src/data", exist_ok=True)
    
    output_path = "public/data/articles.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(all_articles)} articles to {output_path} ({os.path.getsize(output_path)} bytes)")

    compact_path = "public/data/articles.min.json"
    with open(compact_path, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, separators=(',', ':'))
    print(f"Saved compact version to {compact_path} ({os.path.getsize(compact_path)} bytes)")

if __name__ == "__main__":
    main()
