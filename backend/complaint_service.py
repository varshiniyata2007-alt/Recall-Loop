import datetime
from typing import List, Dict, Any, Optional

# Demo Dashboard Problems exactly matching hackathon requirements
INITIAL_PROBLEMS = [
    {
        "id": "prob-payment-failure",
        "name": "Payment Failure",
        "count": 2300,
        "trend": "Increasing", # Increasing
        "recurrence": "Recurring", # Recurring
        "severity": "Critical",
        "category": "Billing & Checkout",
        "last_reported": "5 minutes ago",
        "sample_complaints": [
            "My payment failed three times.",
            "I tried paying with my credit card, but it says transaction declined.",
            "Checkout keeps throwing an error when I try to pay.",
            "Payment went through my bank but your site says payment failed!",
            "Payment failed again today, this is the second time this week."
        ]
    },
    {
        "id": "prob-app-crash",
        "name": "App Crash",
        "count": 1100,
        "trend": "Stable",
        "recurrence": "Recurring", # Recurring
        "severity": "High",
        "category": "Application Stability",
        "last_reported": "22 minutes ago",
        "sample_complaints": [
            "App crashes immediately on launch.",
            "Whenever I open the camera tab the whole app closes.",
            "Sudden crash after updating to version 2.4."
        ]
    },
    {
        "id": "prob-login-issue",
        "name": "Login Issue",
        "count": 700,
        "trend": "Stable", # Stable
        "recurrence": "New", # Stable
        "severity": "Medium",
        "category": "Authentication",
        "last_reported": "1 hour ago",
        "sample_complaints": [
            "Cannot log in with Google OAuth.",
            "Password reset link expired before I could click it.",
            "2FA code is not sending to my email."
        ]
    },
    {
        "id": "prob-slow-loading",
        "name": "Slow Loading",
        "count": 300,
        "trend": "Decreasing", # Decreasing
        "recurrence": "Resolved / Low",
        "severity": "Low",
        "category": "Performance",
        "last_reported": "3 hours ago",
        "sample_complaints": [
            "Dashboard takes 15 seconds to load data.",
            "Images are loading very slowly on mobile.",
            "Search results spin indefinitely."
        ]
    },
    {
        "id": "prob-notification-problem",
        "name": "Notification Problem",
        "count": 250,
        "trend": "Stable", # Stable
        "recurrence": "New",
        "severity": "Low",
        "category": "Messaging",
        "last_reported": "5 hours ago",
        "sample_complaints": [
            "Not receiving push notifications for new messages.",
            "Email notifications are delayed by several hours.",
            "Getting duplicate notifications for every action."
        ]
    }
]

class ComplaintService:
    def __init__(self):
        self.problems = [p.copy() for p in INITIAL_PROBLEMS]
        self.complaint_log = []

    def get_overview_metrics(self) -> Dict[str, Any]:
        """Calculates top-level KPI metrics for Overview Dashboard."""
        total_complaints = sum(p["count"] for p in self.problems)
        active_problems = len(self.problems)
        recurring_problems = sum(1 for p in self.problems if p["recurrence"] == "Recurring")
        increasing_problems = sum(1 for p in self.problems if p["trend"] == "Increasing")

        return {
            "total_complaints": total_complaints,
            "active_problems": active_problems,
            "recurring_problems": recurring_problems,
            "increasing_problems": increasing_problems,
            "problems": self.problems
        }

    def find_problem_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        for p in self.problems:
            if p["name"].lower() == name.lower():
                return p
        return None

    def match_complaint_to_problem(self, complaint_text: str) -> Dict[str, Any]:
        """
        Classifies incoming complaint to underlying product problem.
        Uses semantic keyword mapping combined with heuristics.
        """
        text = complaint_text.lower()
        
        # Payment failure signals
        if any(w in text for w in ["payment", "pay", "card", "declined", "checkout", "transaction", "billing", "charge"]):
            matched = self.find_problem_by_name("Payment Failure")
            similar = [
                "My payment failed three times.",
                "Card declined at checkout repeatedly.",
                "Payment was deducted but transaction shows failed."
            ]
            return {
                "detected_problem": "Payment Failure",
                "confidence": 0.96,
                "category": "Billing & Checkout",
                "severity": "Critical",
                "trend": matched["trend"] if matched else "Increasing",
                "recurrence_status": "Recurring",
                "complaint_count": matched["count"] if matched else 2300,
                "similar_complaints": similar,
                "raw_text": complaint_text
            }

        # App crash signals
        if any(w in text for w in ["crash", "freeze", "closes", "force close", "shut down", "black screen"]):
            matched = self.find_problem_by_name("App Crash")
            return {
                "detected_problem": "App Crash",
                "confidence": 0.94,
                "category": "Application Stability",
                "severity": "High",
                "trend": matched["trend"] if matched else "Stable",
                "recurrence_status": "Recurring",
                "complaint_count": matched["count"] if matched else 1100,
                "similar_complaints": [
                    "App crashes immediately upon opening.",
                    "Crash when clicking profile icon."
                ],
                "raw_text": complaint_text
            }

        # Login issue signals
        if any(w in text for w in ["login", "log in", "password", "auth", "2fa", "sign in", "reset link"]):
            matched = self.find_problem_by_name("Login Issue")
            return {
                "detected_problem": "Login Issue",
                "confidence": 0.92,
                "category": "Authentication",
                "severity": "Medium",
                "trend": matched["trend"] if matched else "Stable",
                "recurrence_status": "New",
                "complaint_count": matched["count"] if matched else 700,
                "similar_complaints": [
                    "Cannot log in with Google OAuth.",
                    "Password reset email never arrived."
                ],
                "raw_text": complaint_text
            }

        # Slow loading signals
        if any(w in text for w in ["slow", "loading", "lag", "hang", "timeout", "delay"]):
            matched = self.find_problem_by_name("Slow Loading")
            return {
                "detected_problem": "Slow Loading",
                "confidence": 0.89,
                "category": "Performance",
                "severity": "Low",
                "trend": matched["trend"] if matched else "Decreasing",
                "recurrence_status": "Resolved / Low",
                "complaint_count": matched["count"] if matched else 300,
                "similar_complaints": [
                    "Dashboard takes over 10 seconds to load.",
                    "Items take forever to load."
                ],
                "raw_text": complaint_text
            }

        # Notification problem
        if any(w in text for w in ["notification", "alert", "email", "push", "notify"]):
            matched = self.find_problem_by_name("Notification Problem")
            return {
                "detected_problem": "Notification Problem",
                "confidence": 0.91,
                "category": "Messaging",
                "severity": "Low",
                "trend": matched["trend"] if matched else "Stable",
                "recurrence_status": "New",
                "complaint_count": matched["count"] if matched else 250,
                "similar_complaints": [
                    "Not receiving push notifications.",
                    "Alerts arrive hours late."
                ],
                "raw_text": complaint_text
            }

        # Default fallback problem classification
        return {
            "detected_problem": "Unclassified Issue",
            "confidence": 0.50,
            "category": "General",
            "severity": "Medium",
            "trend": "Stable",
            "recurrence_status": "New",
            "complaint_count": 1,
            "similar_complaints": [],
            "raw_text": complaint_text
        }

    def register_complaint(self, text: str) -> Dict[str, Any]:
        matched = self.match_complaint_to_problem(text)
        # Increment problem counter if matched
        for p in self.problems:
            if p["name"] == matched["detected_problem"]:
                p["count"] += 1
                p["last_reported"] = "Just now"
                break
        
        entry = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "text": text,
            "matched": matched
        }
        self.complaint_log.append(entry)
        return matched

complaint_service = ComplaintService()
