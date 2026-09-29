# RECALLLOOP
### AI Product Memory Agent
> **Persistent product-solving experience becomes reusable agent memory.**

---

## 💡 The Core Problem
Companies receive thousands of customer complaints through emails, tickets, and feedback channels. When product teams face problems, they struggle with two major issues:
1. Identifying which problems are recurring vs. isolated incidents.
2. **Most importantly, remembering what the team previously tried and what happened afterward.**

When fixes fail or only reduce complaints temporarily, teams forget the previous attempt, repeat the same partial solutions, and lose critical institutional knowledge.

---

## 🚀 The Innovation: Persistent Memory via Hindsight
RecallLoop does **NOT** claim that complaint grouping alone is innovative.  
The core breakthrough is that **previous product-solving experience becomes persistent, reusable agent memory** via **Hindsight**.

### The Learning Loop
```
Problem
   ↓
Previous Action
   ↓
Previous Result
   ↓
Problem Returns
   ↓
Hindsight Recall
   ↓
Product Team Decision
   ↓
New Action
   ↓
New Result
   ↓
Hindsight Memory
   ↓
Future Recall
```

---

## 🔒 Mandatory Hindsight Integration
RecallLoop integrates the official **Vectorize Hindsight SDK** (`hindsight-client`):
- **Retain (`client.retain`)**: Stores product-solving experiences (`Problem` → `Action` → `Result`) into a dedicated Hindsight memory bank (`recallloop-product-memory`).
- **Recall (`client.recall`)**: Queries semantic memory to retrieve what was previously attempted and what outcome was observed.
- **Strict Factual Memory Guarantee**:
  - The agent **NEVER** invents history.
  - If Hindsight has no prior record: **"No relevant previous experience found."**
  - **FACT** is strictly separated from **AI INSIGHT**.
  - The AI does **NOT** automatically fix code or make business decisions—the **product team decides**.

Documentation:
- [Hindsight Docs](https://hindsight.vectorize.io/)
- [GitHub Repository](https://github.com/vectorize-io/hindsight)

---

## 🖥️ Application Screens

1. **Overview Dashboard**
   - KPI metrics: Total Complaints (4,650), Active Problems (5), Recurring Problems (2), Problems Increasing (1).
   - Problem table with complaint counts, trends, and recurrence status:
     - Payment Failure — 2,300 complaints — Increasing — Recurring (Critical)
     - App Crash — 1,100 complaints — Recurring (High)
     - Login Issue — 700 complaints — Stable (Medium)
     - Slow Loading — 300 complaints — Decreasing (Low)
     - Notification Problem — 250 complaints — Stable (Low)

2. **Complaint Analysis**
   - Input raw tickets (e.g., *"My payment failed three times."*).
   - Clustered problem detection, severity assessment, trend analysis, and similar complaints cluster.

3. **Hindsight Memory (The Most Important Screen)**
   - Persistent memory check with real Hindsight Bank verification.
   - **First Occurrence**: Explicitly shows *"No relevant previous experience found."*
   - **Recurring Occurrence**: Prominently highlights **RECURRING PROBLEM** banner:
     > *"Payment Failure is recurring. A previous fix reduced complaints temporarily, but the problem returned."*
   - Two distinct panels:
     - **FACT**: Previous Problem, Previous Action, Previous Result, What happened next.
     - **AGENT INSIGHT**: Synthesized guidance for the product team, reminding them that they make the final business decision.

4. & 5. **Product Team Action & Outcome Recording**
   - Step 4: Product Team Action input (*"Payment gateway changed"* / *"Updated payment gateway"*).
   - Step 5: Outcome / Result input (*"Complaints decreased temporarily"* / *"Payment complaints decreased"*).
   - Retains the new experience into Hindsight.

6. **Learning Loop History**
   - Visually renders the complete Problem ↓ Action ↓ Result ↓ Problem Returned ↓ New Action ↓ New Result loop.
   - Shows chronological audit trail of all persistent memory units in the bank.

---

## ⚙️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons (Dark SaaS UI).
- **Backend**: Python 3.13+, FastAPI, Uvicorn, Pydantic.
- **Memory**: Official Vectorize Hindsight Client (`hindsight-client`).
- **LLM**: Groq API (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`).

---

## 🛠️ Setup & Configuration

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```ini
# Hindsight Configuration (Vectorize Hindsight Cloud or local server)
HINDSIGHT_API_KEY=hsk_your_key_here
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=recallloop-product-memory

# Groq API Configuration
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

> **Note**: Real Hindsight integration is mandatory. Set `HINDSIGHT_API_KEY` in `.env` (obtained from https://ui.hindsight.vectorize.io/signup) or run a local Hindsight server on port 8888. The backend strictly requires authentic Hindsight retain and recall.

### 2. Start Hindsight (Local Engine or Cloud)
- **Local Engine (Port 8888)**:
  Run `start_hindsight.bat` or in terminal:
  ```bash
  start_hindsight.bat
  ```
  *(Runs official embedded PostgreSQL + pgvector + BAAI/bge-small-en-v1.5 embeddings on http://127.0.0.1:8888)*
- **Hindsight Cloud**:
  Simply set `HINDSIGHT_API_KEY=hsk_...` and `HINDSIGHT_API_URL=https://api.hindsight.vectorize.io` in `.env`.

### 3. Start the FastAPI Backend
```bash
py -3.14 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Or double-click `start_backend.bat`.  
API runs at: `http://127.0.0.1:8000`  
Docs available at: `http://127.0.0.1:8000/docs`

### 4. Start the React Frontend
```bash
cd frontend
npm run dev
```
Or double-click `start_frontend.bat`.  
Frontend runs at: `http://localhost:5173`

---

## 🧪 Automated Verification Tests
Run the complete end-to-end learning loop verification:
```bash
py -3.14 test_complete_flow.py
```
Run the full backend test suite:
```bash
py -3.14 test_backend.py
```
Verify the production frontend build:
```bash
cd frontend && npm run build
```

---

## 🎬 60-Second Hackathon Demo Walkthrough

1. **Step 1: First Occurrence**
   - Click **"Launch Payment Demo"** on the dashboard.
   - Analyzes: *"My payment failed three times."*
   - Navigates to **Hindsight Memory**:
     - Confirms: **"No relevant previous experience found."**
     - Verified: Never invents history.

2. **Step 2: Record First Action & Result**
   - Navigate to **Action & Outcome**.
   - Action: `Payment gateway changed`
   - Result: `Complaints decreased temporarily`
   - Click **Save Experience** → Retained into Hindsight!

3. **Step 3: Second Occurrence (The Recurrence Breakthrough)**
   - Click **"Step 2: Second Occurrence (Recall)"** in the top guide bar.
   - Analyzes: *"Card checkout keeps declining at checkout."*
   - Navigates to **Hindsight Memory**:
     - **RECURRING PROBLEM ALERT** displays immediately!
     - Recalls: Previous Action = *Payment gateway changed*, Previous Result = *Complaints decreased temporarily*.
     - Shows Agent Insight explaining why the previous fix was temporary.

4. **Step 4: Record New Permanent Fix**
   - New Action: `Updated payment gateway`
   - New Result: `Payment complaints decreased`
   - Click **Save Experience** → Retained in Hindsight!

5. **Step 5: View Learning Loop History**
   - Click **"View Learning Loop History"** (Screen 6).
   - Proves the persistent loop from first failure to sustainable resolution!
