import sys
import json
from fastapi.testclient import TestClient
from backend.main import app
from backend.hindsight_service import hindsight_service

def test_complete_flow():
    print("=" * 70)
    print("RECALLLOOP: END-TO-END FLOW VERIFICATION")
    print("Testing Complaint -> No Memory -> Retain -> 2nd Complaint -> Recall")
    print("=" * 70)
    
    client = TestClient(app)

    # 1. Reset memory bank
    hindsight_service.clear_bank()
    print("\n[STEP 1] Reset Memory Bank: Clean Initial State Established")

    # 2. First Complaint Arrives
    complaint_1 = "My payment failed three times."
    print(f"\n[STEP 2] Ingest First Customer Complaint:")
    print(f"         \"{complaint_1}\"")
    
    res_1 = client.post("/api/complaints/analyze", json={"complaint": complaint_1})
    assert res_1.status_code == 200, f"Analysis failed: {res_1.text}"
    data_1 = res_1.json()
    
    prob_1 = data_1["classification"]["detected_problem"]
    has_mem_1 = data_1["hindsight_recall"]["has_relevant_experience"]
    fact_1 = data_1["insight_synthesis"]["fact"]
    
    print(f" -> Detected Problem: {prob_1}")
    print(f" -> Hindsight Has Experience: {has_mem_1}")
    print(f" -> Statement: \"{fact_1['statement']}\"")
    
    assert prob_1 == "Payment Failure"
    assert has_mem_1 is False
    assert "No relevant previous experience found" in fact_1["statement"]
    print(" [PASSED] First complaint correctly identified Payment Failure with NO previous memory.")

    # 3. Product Team Records Action & Result
    action_1 = "Payment gateway changed"
    result_1 = "Complaints decreased temporarily"
    print(f"\n[STEP 3] Product Team Records Decision & Retains in Hindsight:")
    print(f"         Problem:      {prob_1}")
    print(f"         Action Taken: {action_1}")
    print(f"         Result:       {result_1}")
    
    res_retain_1 = client.post("/api/memory/retain", json={
        "problem": prob_1,
        "action": action_1,
        "result": result_1
    })
    assert res_retain_1.status_code == 200
    retain_data_1 = res_retain_1.json()
    
    assert retain_data_1["success"] is True
    mem_1 = retain_data_1["memory"]
    print(f" -> Retain Success:  {retain_data_1['success']}")
    print(f" -> Memory Unit ID:  {mem_1['id']}")
    print(f" -> Storage Source:  {mem_1['source']}")
    print(f" -> Memory Bank:     {mem_1['hindsight_bank']}")
    assert mem_1["source"] == "REAL_HINDSIGHT", f"Expected REAL_HINDSIGHT, got {mem_1['source']}"
    print(" [PASSED] Experience realistically stored in Real Hindsight memory.")

    # 4. Second Complaint Arrives (The Recurrence Test)
    complaint_2 = "Card checkout keeps declining at checkout."
    print(f"\n[STEP 4] Ingest Second Customer Complaint:")
    print(f"         \"{complaint_2}\"")
    
    res_2 = client.post("/api/complaints/analyze", json={"complaint": complaint_2})
    assert res_2.status_code == 200
    data_2 = res_2.json()
    
    prob_2 = data_2["classification"]["detected_problem"]
    has_mem_2 = data_2["hindsight_recall"]["has_relevant_experience"]
    recalled_action = data_2["hindsight_recall"]["previous_action"]
    recalled_result = data_2["hindsight_recall"]["previous_result"]
    fact_2 = data_2["insight_synthesis"]["fact"]
    insight_2 = data_2["insight_synthesis"]["agent_insight"]
    
    print(f" -> Detected Problem:             {prob_2}")
    print(f" -> Hindsight Has Experience:     {has_mem_2}")
    print(f" -> Recalled Previous Action:     \"{recalled_action}\"")
    print(f" -> Recalled Previous Result:     \"{recalled_result}\"")
    print(f" -> Recurrence Alert Statement:   \"{fact_2['statement']}\"")
    print(f" -> Agent Insight Headline:       \"{insight_2['headline']}\"")
    print(f" -> Agent Insight Summary:        \"{insight_2['summary']}\"")
    
    assert prob_2 == "Payment Failure"
    assert has_mem_2 is True
    assert recalled_action == action_1, f"Expected '{action_1}', got '{recalled_action}'"
    assert recalled_result == result_1, f"Expected '{result_1}', got '{recalled_result}'"
    assert "recurring" in fact_2["statement"].lower()
    print(" [PASSED] Second complaint recalled previous action + result from Hindsight and triggered RECURRING PROBLEM alert!")

    # 5. Test Dynamic Verification: Not Hardcoded!
    # Let's test with a custom problem and custom action/result to prove it's 100% dynamic
    custom_prob = "Login Issue"
    custom_action = "Migrated OAuth 2.0 provider to Auth0"
    custom_result = "OAuth timeout dropped from 4s to 350ms"
    
    print(f"\n[STEP 5] Verification: Dynamic Hindsight Store & Recall (Non-Hardcoded Check)")
    print(f"         Problem:       {custom_prob}")
    print(f"         Custom Action: {custom_action}")
    print(f"         Custom Result: {custom_result}")
    
    res_retain_custom = client.post("/api/memory/retain", json={
        "problem": custom_prob,
        "action": custom_action,
        "result": custom_result
    })
    assert res_retain_custom.status_code == 200
    
    # Now analyze a login complaint
    res_login = client.post("/api/complaints/analyze", json={"complaint": "Cannot log in with Google OAuth."})
    data_login = res_login.json()
    
    assert data_login["hindsight_recall"]["has_relevant_experience"] is True
    assert data_login["hindsight_recall"]["previous_action"] == custom_action
    assert data_login["hindsight_recall"]["previous_result"] == custom_result
    print(f" -> Dynamically Recalled Action: \"{data_login['hindsight_recall']['previous_action']}\"")
    print(f" -> Dynamically Recalled Result: \"{data_login['hindsight_recall']['previous_result']}\"")
    print(" [PASSED] Proven 100% dynamic: Custom experiences are stored and recalled without hard-coding!")

    # 6. Reset bank after test to leave demo clean
    hindsight_service.clear_bank()
    print("\n[STEP 6] Reset Memory Bank to pristine demo state.")

    print("\n" + "=" * 70)
    print("ALL VERIFICATION CHECKS PASSED WITH 100% ACCURACY!")
    print("=" * 70)

if __name__ == "__main__":
    test_complete_flow()
