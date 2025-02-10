from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from PIL import Image
import pytesseract
import os
import chardet  # For detecting file encoding

app = Flask(__name__)

# Configure Gemini API
API_KEY = 'AIzaSyAUYFYXD-xMcgYOwsYIoCabWAdcARkwnK4'  # Replace with your actual API key
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        # Get uploaded file
        file = request.files['file']
        if not file:
            return jsonify({'error': 'No file uploaded'}), 400

        # Determine file type and extract text
        document_text = ""
        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension in ['.txt']:
            # Plain text file: Detect encoding and decode
            raw_data = file.read()
            detected_encoding = chardet.detect(raw_data)['encoding']

            try:
                # Decode using detected encoding, fallback to ISO-8859-1 if needed
                document_text = raw_data.decode(detected_encoding or 'utf-8', errors='replace')
            except Exception:
                document_text = raw_data.decode('ISO-8859-1', errors='replace')

        elif file_extension in ['.pdf']:
            # PDF file (requires PyPDF2)
            from PyPDF2 import PdfReader
            pdf_reader = PdfReader(file)
            document_text = "\n".join(page.extract_text() for page in pdf_reader.pages)

        elif file_extension in ['.docx']:
            # DOCX file (requires python-docx)
            from docx import Document
            doc = Document(file)
            document_text = "\n".join(paragraph.text for paragraph in doc.paragraphs)

        elif file_extension in ['.jpeg', '.jpg', '.png']:
            # Image file (requires OCR)
            image = Image.open(file)
            document_text = pytesseract.image_to_string(image)

        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        # Define prompt for summarization
        prompt = (
            "You are a legal expert. Summarize the following legal document in clear and concise language:\n\n"
            f"{document_text}"
        )

        # Generate summary using Gemini API
        response = model.generate_content(prompt)
        summary = response.text.strip()

        return jsonify({'summary': summary})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)