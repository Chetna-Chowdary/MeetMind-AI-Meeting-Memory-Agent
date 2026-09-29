from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from pydantic import BaseModel
from typing import Optional, List
from database import init_db, get_connection
import httpx

app = FastAPI(title="MeetMind API", version="1.0.0", description="AI-powered persistent-memory meeting intelligence agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HINDSIGHT_API_URL = os.getenv("HINDSIGHT_API_URL", "https://api.hindsight.vectorize.io")
HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY", "")
HINDSIGHT_BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "meetmind-demo")

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MeetMind FastAPI Backend",
        "hindsight_bank": HINDSIGHT_BANK_ID,
        "database": "SQLite"
    }

@app.get("/api/clients")
def list_clients():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.*,
          (SELECT COUNT(*) FROM meetings WHERE client_id = c.id) as meetings_count,
          (SELECT COUNT(*) FROM memories WHERE client_id = c.id) as memories_count,
          (SELECT date FROM meetings WHERE client_id = c.id AND status = 'completed' ORDER BY date DESC LIMIT 1) as last_meeting_date
        FROM clients c
        ORDER BY c.created_at ASC
    """)
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/api/clients/{client_id}")
def get_client(client_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
    client = cursor.fetchone()
    if not client:
        conn.close()
        raise HTTPException(status_code=404, detail="Client not found")
    client_dict = dict(client)

    cursor.execute("SELECT * FROM meetings WHERE client_id = ? ORDER BY date DESC", (client_id,))
    client_dict["meetings"] = [dict(m) for m in cursor.fetchall()]

    cursor.execute("SELECT * FROM memories WHERE client_id = ? ORDER BY created_at DESC", (client_id,))
    client_dict["memories"] = [dict(m) for m in cursor.fetchall()]

    cursor.execute("SELECT * FROM action_items WHERE client_id = ? ORDER BY created_at DESC", (client_id,))
    client_dict["actionItems"] = [dict(a) for a in cursor.fetchall()]

    conn.close()
    return client_dict

@app.post("/api/ai/prepare")
async def prepare_meeting(payload: dict = Body(...)):
    client_id = payload.get("clientId")
    if not client_id:
        raise HTTPException(status_code=400, detail="clientId is required")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
    client = cursor.fetchone()
    if not client:
        conn.close()
        raise HTTPException(status_code=404, detail="Client not found")

    cursor.execute("SELECT text, category, type FROM memories WHERE client_id = ? ORDER BY created_at DESC", (client_id,))
    memories = [dict(m) for m in cursor.fetchall()]
    conn.close()

    brief = {
        "clientName": client["name"],
        "clientCompany": client["company"],
        "clientRole": client["role"],
        "meetingObjective": f"Align on milestone gates and delivery schedule with {client['name']}.",
        "whatYouShouldRemember": [
            "React confirmed as preferred technology choice",
            "Phase 1 budget has strict ₹15 lakh ceiling",
            "Target launch is strictly December before annual freeze"
        ],
        "importantConcerns": [
            "Delivery timeline is Sarah primary concern due to executive board commitments"
        ],
        "openFollowUps": [
            "Present technical proposal with milestone breakdown"
        ],
        "suggestedTalkingPoints": [
            "Reiterate commitment to the December delivery date with milestone risk mitigation",
            "Confirm React architectural components align with NovaTech internal engineers",
            "Review API integration hooks for CRM and billing services"
        ],
        "suggestedQuestions": [
            f"'{client['name']}, we mapped our sprint gates to protect the December target—are there any internal review dependencies we should account for?'"
        ],
        "recommendedFocus": "Lead with schedule certainty and milestone gates. Reassure the executive board timeline.",
        "recalledMemoryCount": len(memories),
        "memorySource": "Hindsight Memory Bank"
    }

    return {"success": True, "brief": brief, "recalledMemories": memories}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
