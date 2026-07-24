from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.pdf_service import PDFService
from services.chunk_service import ChunkService
from services.embedding_service import EmbeddingService
from services.vector_service import VectorService
from services.prompt_service import PromptService
from services.llm_service import LLMService
from services.warning_service import WarningService

router = APIRouter(
    prefix="/analyze",
    tags=["Analysis"]
)


class AnalyzeRequest(BaseModel):
    report: str
    pdf_path: str


@router.post("/")
def analyze_report(request: AnalyzeRequest):
    """
    Analyze a construction inspection report using
    RAG (PDF + FAISS + Nous Hermes).
    """

    try:
        # Step 1 - Read PDF
        pdf_service = PDFService()
        pdf_text = pdf_service.extract_text(request.pdf_path)

        if not pdf_text:
            raise HTTPException(
                status_code=400,
                detail="Unable to extract text from PDF."
            )

        # Step 2 - Split PDF text into chunks
        chunk_service = ChunkService()
        chunks = chunk_service.split_text(pdf_text)

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No text chunks were generated."
            )

        # Step 3 - Generate embeddings
        embedding_service = EmbeddingService()
        embeddings = embedding_service.generate_embeddings(chunks)

        if len(embeddings) == 0:
            raise HTTPException(
                status_code=400,
                detail="Failed to generate embeddings."
            )

        # Step 4 - Create FAISS index
        dimension = len(embeddings[0])

        vector_service = VectorService(dimension)
        vector_service.add_embeddings(
            embeddings,
            chunks
        )

        # Step 5 - Generate query embedding
        query_embedding = embedding_service.generate_embeddings(
            [request.report]
        )[0]

        # Step 6 - Search similar chunks
        retrieved_chunks = vector_service.search(
            query_embedding,
            k=3
        )

        # Step 7 - Build prompt
        prompt_service = PromptService()

        prompt = prompt_service.build_prompt(
            request.report,
            retrieved_chunks
        )

        # Step 8 - Analyze with LLM
        llm_service = LLMService()

        analysis = llm_service.analyze(prompt)

        # Step 9 - Format response
        warning_service = WarningService()

        result = warning_service.generate_warning_report(
            analysis
        )

        # Step 10 - Add metadata
        result["inspection_report"] = request.report
        result["chunks_retrieved"] = len(retrieved_chunks)

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )