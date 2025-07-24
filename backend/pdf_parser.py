#!/usr/bin/env python3
"""
Enhanced PDF Parser for Medical NER Annotation UI
Extracts and preprocesses text content from PDF files using pdfplumber
"""

import sys
import json
import re
import pdfplumber
from pathlib import Path
from typing import Dict

def preprocess_medical_text(text: str) -> str:
    """
    Preprocess extracted text for better medical NER annotation
    """
    # Fix broken medical terms
    text = re.sub(r'\b([A-Z])\s+([a-z]+)\b', r'\1\2', text)

    # Fix dosage formatting
    text = re.sub(r'(\d+)\s*(mg|ml|g|mcg|units?)\b', r'\1\2', text)

    # Fix spaced-out abbreviations like "T I C I"
    text = re.sub(r'\b([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\b', r'\1\2\3\4', text)

    # Preserve score formats
    text = re.sub(r'\b([A-Z]{2,})\s+(\d+[a-z]?)\b', r'\1 \2', text)

    # Fix broken decimal numbers
    text = re.sub(r'(\d+)\s+\.\s+(\d+)', r'\1.\2', text)

    # Fix punctuation spacing
    text = re.sub(r'\s+([.,;:])\s*', r'\1 ', text)

    return text

def extract_text_main(pdf_path: str) -> Dict:
    """
    Enhanced layout-preserving extraction with medical cleanup
    """
    with pdfplumber.open(pdf_path) as pdf:
        text_content = ""
        page_count = len(pdf.pages)
        word_count = 0

        for i, page in enumerate(pdf.pages, 1):
            page_text = page.extract_text(x_tolerance=2, y_tolerance=2)

            if not page_text or len(page_text.strip()) < 10:
                tables = page.extract_tables()
                if tables:
                    table_text = "\n".join([
                        " | ".join([cell or "" for cell in row])
                        for table in tables
                        for row in table
                    ])
                    page_text = table_text

            if not page_text or len(page_text.strip()) < 10:
                chars = sorted(page.chars, key=lambda x: (x['top'], x['x0']))
                page_text = "".join([c['text'] for c in chars])

            if page_text:
                if i > 1:
                    text_content += f"\n--- Page {i} ---\n"
                text_content += page_text + "\n"
                word_count += len(page_text.split())

        cleaned_lines = [
            ' '.join(line.strip().split())
            if not line.startswith("--- Page")
            else line.strip()
            for line in text_content.split('\n') if line.strip()
        ]

        final_text = preprocess_medical_text('\n'.join(cleaned_lines))

        return {
            'text': final_text,
            'pages': page_count,
            'word_count': word_count,
            'filename': Path(pdf_path).name,
            'entities': [],
            'success': True,
            'extraction_method': 'enhanced_medical'
        }

def extract_text_fallback(pdf_path: str) -> Dict:
    """
    Simple fallback extraction method
    """
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join(filter(None, [p.extract_text() for p in pdf.pages]))
        lines = text.split('\n')
        cleaned = '\n'.join([' '.join(l.split()) for l in lines if l.strip()])
        return {
            'text': cleaned,
            'pages': len(pdf.pages),
            'filename': Path(pdf_path).name,
            'entities': [],
            'success': True,
            'extraction_method': 'simple_fallback'
        }

def extract_text_from_pdf(pdf_path: str) -> Dict:
    try:
        result = extract_text_main(pdf_path)
        if not result['text'].strip():
            return extract_text_fallback(pdf_path)
        return result
    except Exception as e:
        return {
            'text': '',
            'entities': [],
            'success': False,
            'error': str(e),
            'filename': Path(pdf_path).name
        }

def main():
    if len(sys.argv) not in [2, 3]:
        print(json.dumps({
            'error': 'Usage: python pdf_parser.py <input.pdf> [output.json]',
            'success': False
        }))
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not Path(pdf_path).exists():
        print(json.dumps({
            'error': f'File not found: {pdf_path}',
            'success': False
        }))
        sys.exit(1)

    result = extract_text_from_pdf(pdf_path)

    if len(sys.argv) == 3:
        output_path = sys.argv[2]
        Path(output_path).write_text(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
