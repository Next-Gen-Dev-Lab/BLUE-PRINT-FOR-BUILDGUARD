# BuildGuard-AI

Site Blueprint & Safety Compliance Engine — a Python/FastAPI microservice that
analyzes construction site inspection reports against blueprint safety
documents and municipal safety rules, detects violations via a RAG pipeline
(Nous Hermes), and generates structured warning notices (OpenClaw).

Consumed by a Spring Boot backend; not exposed directly to the internet.

## Folder structure

```
BuildGuard-AI/
├── app.py                  # FastAPI entrypoint — wiring only, no logic
├── requirements.txt
├── .env.example             # copy to .env and fill in real values
├── config/
│   └── config.py             # typed settings, loaded once via lru_cache
├── api/
│   ├── health.py              # GET /health, GET /status
│   ├── analyze.py              # POST /analyze          (Phase 13)
│   └── warning.py              # POST /warning           (Phase 13)
├── services/
│   ├── s3_service.py            # fetch blueprint/manual PDFs   (Phase 3)
│   ├── pdf_service.py            # extract + clean PDF text      (Phase 4)
│   ├── chunk_service.py           # LangChain text splitting       (Phase 5)
│   ├── embedding_service.py        # embeddings generation           (Phase 6)
│   ├── vector_service.py            # FAISS index lifecycle            (Phase 7)
│   ├── rds_service.py                 # inspection/worker/schedule data (Phase 8)
│   ├── prompt_service.py               # prompt construction             (Phase 9)
│   ├── llm_service.py                   # RAG orchestration + Nous Hermes (Phase 10-11)
│   └── warning_service.py                # OpenClaw notice generation      (Phase 12)
├── models/
│   ├── request_model.py
│   └── response_model.py
├── vector_db/                # persisted FAISS index (gitignored)
└── uploads/                  # local scratch space for downloaded PDFs (gitignored)
```

## Local setup

```bash
python3.11 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # then fill in AWS/RDS/LLM credentials
uvicorn app:app --reload --port 8000
```

Verify it's up:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/status
```

Swagger docs (auto-generated once analyze/warning routers land in Phase 13):
`http://localhost:8000/docs`

## Build order

This project is implemented phase by phase (see project spec). Each phase's
service is independently testable before the next one is wired in:

1. Architecture (done)
2. Project setup (done — this commit)
3. `s3_service.py` — S3 document retrieval
4. `pdf_service.py` — PDF text extraction
5. `chunk_service.py` — document chunking
6. `embedding_service.py` — embedding generation
7. `vector_service.py` — FAISS index
8. `rds_service.py` — Amazon RDS reads
9. `prompt_service.py` — prompt engineering
10. `llm_service.py` — LangChain RAG pipeline + Nous Hermes
11. Violation detection logic (part of `llm_service.py`)
12. `warning_service.py` — OpenClaw warning generation
13. `api/analyze.py`, `api/warning.py` — FastAPI endpoints
14. Postman test collection
15. Spring Boot integration docs
16. Deployment guide (local / EC2 / Docker)

## Security notes

- This service is **read-only** against RDS by design — it never writes back,
  which simplifies the security review and blast radius if compromised.
- AWS credentials should come from an IAM role in EC2/ECS, not `.env`, once deployed.
- `.env`, `vector_db/`, and `uploads/` are gitignored — never commit real
  credentials or extracted site documents.
# BuildGuard-GenAI
GenAI microservice for BuildGuard Site Blueprint &amp; Safety Compliance Engine using FastAPI.
