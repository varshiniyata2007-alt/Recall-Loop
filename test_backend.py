import json
from fastapi.testclient import TestClient
from backend.main import app
from backend.hindsight_service import hindsight_service

def run_tests():
    print("=== STARTING RECALLLOOP BACKEND TESTS ===")
    client = TestClient(app)
    
    # 0. Reset memories to start clean
    hindsight_service.clear_bank()
    
    # 1. System Status
    res = client.get("/api/status")
    assert res.status_code == 200, res.text
    status_data = res.json()
    print("[OK] /api/status OK:", status_data["app_name"], "| Hindsight Status:", status_data["hindsight"]["status"])
    
    # 2. Overview Dashboard
    res = client.get("/api/dashboard/overview")
    assert res.status_code == 200
    overview = res.json()
    print(f"[OK] /api/dashboard/overview OK: Total Complaints={overview['total_complaints']}, Problems={len(overview['problems'])}")
    assert overview['total_complaints'] == 4650, f"Expected 4650, got {overview['total_complaints']}"
    assert overview['recurring_problems'] == 2, f"Expected 2 recurring, got {overview['recurring_problems']}"
    assert overview['increasing_problems'] == 1, f"Expected 1 increasing, got {overview['increasing_problems']}"
    
    # 3. First Occurrence of Payment Complaint
    complaint_1 = "My payment failed three times."
    print(f"\n--- OCCURRENCE 1: Complaint arrives: '{complaint_1}' ---")
    res = client.post("/api/complaints/analyze", json={"complaint": complaint_1})
    assert res.status_code == 200
    analysis_1 = res.json()
    
    prob_name = analysis_1["classification"]["detected_problem"]
    has_mem_1 = analysis_1["hindsight_recall"]["has_relevant_experience"]
    fact_1 = analysis_1["insight_synthesis"]["fact"]
    
    print(f"Detected Problem: {prob_name}")
    print(f"Has Relevant Experience in Hindsight: {has_mem_1}")
    print(f"Fact Statement: {fact_1['statement']}")
    assert prob_name == "Payment Failure"
    assert has_mem_1 is False
    assert "No relevant previous experience found" in fact_1["statement"]
    print("[OK] Occurrence 1 correctly verified: No previous memory found.")
    
    # 4. Product Team Records First Action & Result
    print("\n--- PRODUCT TEAM RECORDS EXPERIENCE ---")
    action_1 = "Payment gateway changed"
    result_1 = "Complaints decreased temporarily"
    res = client.post("/api/memory/retain", json={
        "problem": "Payment Failure",
        "action": action_1,
        "result": result_1
    })
    assert res.status_code == 200
    retain_res = res.json()
    print(f"[OK] Retained in Hindsight: {retain_res['success']} | Source: {retain_res['memory']['source']}")
    
    # 5. Second Occurrence of Payment Complaint
    complaint_2 = "Card checkout keeps declining at checkout"
    print(f"\n--- OCCURRENCE 2: Second complaint arrives: '{complaint_2}' ---")
    res = client.post("/api/complaints/analyze", json={"complaint": complaint_2})
    assert res.status_code == 200
    analysis_2 = res.json()
    
    has_mem_2 = analysis_2["hindsight_recall"]["has_relevant_experience"]
    recalled_action = analysis_2["hindsight_recall"]["previous_action"]
    recalled_result = analysis_2["hindsight_recall"]["previous_result"]
    fact_2 = analysis_2["insight_synthesis"]["fact"]
    insight_2 = analysis_2["insight_synthesis"]["agent_insight"]
    
    print(f"Has Relevant Experience: {has_mem_2}")
    print(f"Recalled Previous Action: {recalled_action}")
    print(f"Recalled Previous Result: {recalled_result}")
    print(f"Agent Insight Headline: {insight_2['headline']}")
    print(f"Recurrence Alert: {insight_2['recurrence_alert']}")
    
    assert has_mem_2 is True
    assert recalled_action == action_1
    assert recalled_result == result_1
    assert "recurring" in fact_2["statement"].lower()
    print("[OK] Occurrence 2 correctly retrieved persistent Hindsight memory and flagged recurrence!")
    
    # 6. Product Team Records Second Action & Result
    print("\n--- PRODUCT TEAM RECORDS SECOND ITERATION ---")
    action_2 = "Updated payment gateway"
    result_2 = "Payment complaints decreased"
    res = client.post("/api/memory/retain", json={
        "problem": "Payment Failure",
        "action": action_2,
        "result": result_2
    })
    assert res.status_code == 200
    print("[OK] Second experience retained in Hindsight.")
    
    # 7. Check History Loop (Screen 6)
    res = client.get("/api/memory/history")
    assert res.status_code == 200
    history = res.json()
    print(f"\n[OK] /api/memory/history OK: Total logged cycles = {history['count']}")
    assert history['count'] == 2
    
    print("\n=======================================================")
    print("ALL CORE RECALLLOOP BACKEND TESTS PASSED SUCCESSFULLY!!")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
