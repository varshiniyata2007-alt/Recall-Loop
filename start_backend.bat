@echo off
echo Starting RecallLoop FastAPI Backend on http://127.0.0.1:8000 ...
py -3.14 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
