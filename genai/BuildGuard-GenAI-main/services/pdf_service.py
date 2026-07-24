from pypdf import PdfReader


class PDFService:
    def extract_text(self, pdf_path):
        """
        Extract all text from a PDF file.
        """
        try:
            reader = PdfReader(pdf_path)

            text = ""

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            return text

        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""