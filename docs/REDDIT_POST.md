# Reddit Post: r/MachineLearning & r/webdev

**Post Title:** I built MeetMind — an AI meeting assistant that remembers previous conversations

**Body:**

Hey everyone,

I've been working on a project for an AI hackathon and wanted to share the architecture and get technical feedback from the community.

### The Problem
Almost every AI meeting assistant today is stateless. It transcribes audio, produces a summary of that single meeting, and then effectively wipes its memory.

If you meet with a client on September 10 and they tell you:
- "We need a mobile app"
- Then on September 18: "We prefer React because our in-house devs know it"
- Then on September 25: "Our budget is capped at ₹15 lakh and our biggest worry is slipping past December"

When you meet them again today, generic LLM tools will still ask generic questions like "What are your goals?" and "What technologies do you like?" because they have zero persistent memory across sessions.

### What I Built: MeetMind
MeetMind is an open-source meeting intelligence agent designed around persistent client memory. 

Instead of re-feeding bloated transcripts into a prompt or doing simple vector cosine search over documents, MeetMind uses **Hindsight** (@vectorize-io/hindsight-client) as its persistent agent memory layer.

### How Memory Works:
1. **Extraction:** After a meeting, notes are analyzed by **Google Gemini 3.8 Flash** to extract structured facts, constraints, budgets, preferences, and risks.
2. **Retention:** Each fact is ingested into a dedicated Hindsight memory bank using `hindsight.retain()` tagged by client ID.
3. **Multi-Strategy Recall:** Hindsight uses TEMPR (combining vector search, BM25 keyword matching, entity graph traversal, and temporal reasoning).
4. **Prepare Me:** Before your next meeting, one click retrieves the relevant facts and generates an executive brief:
   - What You Should Remember
   - Important Concerns
   - Open Commitments
   - Suggested Strategic Talking Points & Questions
5. **Contextual Follow-ups:** Drafts personalized follow-up emails grounded in what was actually agreed upon.

### The Tech Stack:
- **Persistent Memory:** Hindsight Cloud SDK (`@vectorize-io/hindsight-client`)
- **LLM:** Google Gemini 3.8 Flash (`@google/genai`)
- **Backend:** Express / FastAPI full-stack with SQLite (`sql.js` WASM engine for zero native compilation dependencies)
- **Frontend:** React 19, Tailwind CSS, Lucide icons (strictly zero-pill metadata design, clean typography)

### Demo & Code:
- **Live Demo:** [Demo URL]
- **GitHub:** [Repository URL]
- **Architecture Article:** [Article Link]

I'd love feedback on:
1. How you handle temporal memory invalidation when client requirements supersede previous ones.
2. Best practices for structuring observation scopes in multi-tenant agent memory banks.

Thanks for checking it out!
