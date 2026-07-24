from langchain_text_splitters import RecursiveCharacterTextSplitter


class ChunkService:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def split_text(self, text):
        """
        Split extracted PDF text into chunks for embedding.
        """
        return self.text_splitter.split_text(text)