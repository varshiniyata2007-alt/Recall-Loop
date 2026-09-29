@echo off
echo ==============================================================================
echo Starting Official Hindsight Memory Server on http://127.0.0.1:8888
echo Running PostgreSQL embedded engine + BAAI/bge-small-en-v1.5 embeddings
echo ==============================================================================
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
set HINDSIGHT_API_LLM_PROVIDER=mock
set HINDSIGHT_API_EMBEDDINGS_PROVIDER=local
set HINDSIGHT_API_RERANKER_PROVIDER=local
set HINDSIGHT_API_SKIP_LLM_VERIFICATION=true
py -3.14 -X utf8 -m hindsight_api.main --port 8888
pause
