import os
import faiss
import numpy as np
from config.config import settings


class VectorService:
    """
    Handles FAISS vector storage and similarity search.
    """

    def __init__(self, dimension):
        self.dimension = dimension
        self.text_chunks = []

        if os.path.exists(settings.faiss_index_path):
            self.index = faiss.read_index(settings.faiss_index_path)
        else:
            self.index = faiss.IndexFlatL2(dimension)

    def add_embeddings(self, embeddings, chunks):
        """
        Add embeddings and corresponding text chunks.
        """
        embeddings = np.asarray(embeddings).astype("float32")

        self.index.add(embeddings)
        self.text_chunks.extend(chunks)

    def search(self, query_embedding, k=3):
        """
        Retrieve the top-k most similar chunks.
        """
        query_embedding = np.asarray([query_embedding]).astype("float32")

        distances, indices = self.index.search(query_embedding, k)

        results = []

        for idx in indices[0]:
            if idx != -1 and idx < len(self.text_chunks):
                results.append(self.text_chunks[idx])

        return results

    def save_index(self):
        """
        Save the FAISS index.
        """
        os.makedirs(os.path.dirname(settings.faiss_index_path), exist_ok=True)
        faiss.write_index(self.index, settings.faiss_index_path)

    def load_index(self):
        """
        Load the FAISS index if it exists.
        """
        if os.path.exists(settings.faiss_index_path):
            self.index = faiss.read_index(settings.faiss_index_path)