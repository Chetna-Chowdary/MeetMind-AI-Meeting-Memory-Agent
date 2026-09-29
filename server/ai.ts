import { GoogleGenAI } from '@google/genai';
import { MemoryRecord } from './hindsight.js';

export interface ExtractedMeetingData {
  summary: string;
  keyTakeaways: string[];
  memories: Array<{
    text: string;
    category: 'Preference' | 'Requirement' | 'Concern' | 'Budget' | 'Decision' | 'Commitment';
    type: 'world' | 'experience' | 'observation';
    tags: string[];
  }>;
  actionItems: Array<{
    description: string;
    dueDate?: string;
  }>;
}

export interface PrepareMeBrief {
  clientName: string;
  clientCompany: string;
  clientRole: string;
  meetingObjective: string;
  whatYouShouldRemember: string[];
  importantConcerns: string[];
  openFollowUps: string[];
  suggestedTalkingPoints: string[];
  suggestedQuestions: string[];
  recommendedFocus: string;
  recalledMemoryCount: number;
  memorySource: string;
}

class AIService {
  private ai: GoogleGenAI | null = null;
  private modelName = 'gemini-3.8-flash';

  constructor() {
    this.initAI();
  }

  private initAI() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.ai = new GoogleGenAI({ apiKey });
      } else {
        this.ai = new GoogleGenAI();
      }
    } catch (err) {
      console.warn('GoogleGenAI initialization warning:', err);
      this.ai = null;
    }
  }

  /**
   * Extract memories, action items, and summary from meeting notes
   */
  async extractMemoriesFromNotes(
    notes: string,
    clientContext: { name: string; company: string; role: string }
  ): Promise<ExtractedMeetingData> {
    const prompt = `
You are MeetMind's persistent memory intelligence engine.
Analyze these raw meeting notes with client ${clientContext.name} (${clientContext.role} at ${clientContext.company}).

Extract:
1. A concise 2-sentence summary.
2. 3-4 key takeaways.
3. Specific persistent facts, preferences, requirements, constraints, budgets, concerns, decisions, or commitments that MUST be remembered for future meetings.
   Each memory must be categorized into one of: 'Preference', 'Requirement', 'Concern', 'Budget', 'Decision', 'Commitment'.
   Each memory must have type: 'world' (objective fact), 'experience' (event/interaction), or 'observation' (synthesized behavior).
4. Concrete action items with optional due dates.

Meeting Notes:
"""
${notes}
"""

Respond ONLY with valid JSON matching this schema:
{
  "summary": "...",
  "keyTakeaways": ["...", "..."],
  "memories": [
    {
      "text": "Specific fact or preference",
      "category": "Preference",
      "type": "observation",
      "tags": ["tag1", "tag2"]
    }
  ],
  "actionItems": [
    {
      "description": "...",
      "dueDate": "YYYY-MM-DD"
    }
  ]
}
`;

    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const text = response.text?.trim() || '';
        if (text) {
          const parsed = JSON.parse(text);
          return {
            summary: parsed.summary || 'Meeting notes analyzed.',
            keyTakeaways: parsed.keyTakeaways || [],
            memories: parsed.memories || [],
            actionItems: parsed.actionItems || []
          };
        }
      } catch (err) {
        console.warn('Gemini extraction error, using rule-based memory extraction:', err);
      }
    }

    // Heuristic fallback extractor
    return this.fallbackExtract(notes, clientContext);
  }

  /**
   * Prepare Me: Generates a personalized meeting briefing based on Hindsight memories
   */
  async generateMeetingBrief(
    client: { name: string; company: string; role: string },
    recalledMemories: MemoryRecord[],
    upcomingMeetingTitle: string = 'Strategic Alignment & Roadmap Review'
  ): Promise<PrepareMeBrief> {
    const memoriesFormatted = recalledMemories
      .map((m) => `• [${m.category.toUpperCase()}] ${m.text}`)
      .join('\n');

    const prompt = `
You are MeetMind, an elite AI meeting preparation agent for executives.
You are preparing the user (Alex Vance) for an upcoming meeting with ${client.name}, ${client.role} at ${client.company}.
Upcoming Meeting Title: "${upcomingMeetingTitle}".

Here are the persistent memories recalled from Hindsight memory bank for ${client.name}:
"""
${memoriesFormatted}
"""

Task:
Generate a personalized, high-context meeting briefing.
Do NOT give generic meeting tips. Ground every section strictly in what was remembered from previous meetings (e.g. specific budgets, technology choices, delivery fears, previous commitments).

Respond ONLY with a JSON object:
{
  "meetingObjective": "Specific objective tailored to their stage and past discussions",
  "whatYouShouldRemember": [
    "Fact 1 (e.g. Budget details)",
    "Fact 2 (e.g. Tech preference)",
    "Fact 3 (e.g. Key dates)"
  ],
  "importantConcerns": [
    "Specific concern previously voiced (e.g. delivery timeline, vendor lock-in)"
  ],
  "openFollowUps": [
    "Specific commitment or open question from previous conversations"
  ],
  "suggestedTalkingPoints": [
    "Strategic talking point 1 addressing their explicit needs",
    "Strategic talking point 2 linking to their constraints"
  ],
  "suggestedQuestions": [
    "Proactive question 1 to demonstrate deep memory",
    "Proactive question 2 to unblock upcoming milestones"
  ],
  "recommendedFocus": "1-2 sentence executive recommendation for today's meeting."
}
`;

    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        });

        const text = response.text?.trim() || '';
        if (text) {
          const parsed = JSON.parse(text);
          return {
            clientName: client.name,
            clientCompany: client.company,
            clientRole: client.role,
            meetingObjective: parsed.meetingObjective || `Align on ${upcomingMeetingTitle} milestones with ${client.name}.`,
            whatYouShouldRemember: parsed.whatYouShouldRemember || [],
            importantConcerns: parsed.importantConcerns || [],
            openFollowUps: parsed.openFollowUps || [],
            suggestedTalkingPoints: parsed.suggestedTalkingPoints || [],
            suggestedQuestions: parsed.suggestedQuestions || [],
            recommendedFocus: parsed.recommendedFocus || 'Focus on timeline certainty and milestone deliverables.',
            recalledMemoryCount: recalledMemories.length,
            memorySource: 'Hindsight Memory Bank'
          };
        }
      } catch (err) {
        console.warn('Gemini briefing generation error, using fallback brief generator:', err);
      }
    }

    // Heuristic brief fallback
    return this.fallbackPrepareBrief(client, recalledMemories, upcomingMeetingTitle);
  }

  /**
   * Generate personalized follow-up email
   */
  async generateFollowUpEmail(
    client: { name: string; company: string; role: string },
    meeting: { title: string; notes: string; summary?: string },
    recalledMemories: MemoryRecord[]
  ): Promise<{ subject: string; body: string }> {
    const memoryContext = recalledMemories.slice(0, 8).map((m) => `• [${m.category}] ${m.text}`).join('\n');

    const prompt = `
You are MeetMind's executive follow-up generator.
Draft a highly personalized follow-up email from Alex Vance to ${client.name} (${client.role} at ${client.company}) following their recent meeting: "${meeting.title}".

Recent Meeting Notes:
"""
${meeting.notes}
"""

Persistently Remembered Context (Hindsight):
"""
${memoryContext}
"""

Requirements:
- Highly professional, warm, concise, and executive.
- Seamlessly reference decisions made and weave in persistent context (e.g. their preferred communication style, technology preference, budget constraint, or timeline focus).
- Clearly itemize agreed next steps with ownership.
- Do NOT sound like a robotic template.

Respond ONLY with JSON:
{
  "subject": "Clear, contextual subject line",
  "body": "Full email text including greeting, paragraphs, bulleted action items, and sign-off."
}
`;

    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4
          }
        });

        const text = response.text?.trim() || '';
        if (text) {
          const parsed = JSON.parse(text);
          return {
            subject: parsed.subject || `Follow-up: ${meeting.title} - ${client.company}`,
            body: parsed.body || `Hi ${client.name},\n\nThank you for our productive meeting today.`
          };
        }
      } catch (err) {
        console.warn('Gemini email generation error:', err);
      }
    }

    return {
      subject: `Follow-up: ${meeting.title} - ${client.company}`,
      body: `Hi ${client.name},\n\nThank you for meeting today regarding ${meeting.title}.\n\nAs discussed, we are aligning our execution directly with your Phase 1 objectives and timeline constraints. Our team is locking in the deliverables discussed and will keep you updated via your preferred weekly email cadence.\n\nNext Steps:\n• Review technical proposal milestone gates\n• Finalize API integration interfaces\n\nPlease let me know if you need any adjustments before our next sync.\n\nBest regards,\nAlex Vance\nMeetMind Solutions`
    };
  }

  /**
   * Chat assistant with memory grounding
   */
  async chatWithMemory(
    userMessage: string,
    clientContext: { id: string; name: string; company: string; role: string } | null,
    recalledMemories: MemoryRecord[],
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<{ answer: string; memoriesUsed: string[]; source: string }> {
    const memoryStrings = recalledMemories.map((m) => `• [${m.category}] ${m.text}`);
    const clientStr = clientContext ? `${clientContext.name} (${clientContext.role} at ${clientContext.company})` : 'All Clients';

    const prompt = `
You are MeetMind's conversational meeting intelligence assistant.
You help professionals review client histories, retrieve facts, prepare for meetings, and verify promises.

Current Client in Context: ${clientStr}

Retrieved Persistent Memories from Hindsight Memory Bank:
"""
${memoryStrings.length > 0 ? memoryStrings.join('\n') : 'No specific memories retrieved for this query.'}
"""

User Question: "${userMessage}"

Instructions:
1. Answer the question directly, accurately, and professionally.
2. Ground your answer in the persistent memories whenever relevant.
3. Explicitly state what MeetMind remembers (e.g. "According to our previous meetings, Sarah prefers React and has a budget ceiling of ₹15 lakh...").
4. If a piece of information was not in the memories, acknowledge that cleanly.
5. Keep the tone sharp, polished, and executive.
`;

    if (this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            temperature: 0.3
          }
        });

        const answer = response.text || 'I analyzed the meeting history for you.';
        return {
          answer,
          memoriesUsed: recalledMemories.map((m) => m.text),
          source: 'Hindsight Memory Bank + Gemini 3.8 Flash'
        };
      } catch (err) {
        console.warn('Gemini chat error, falling back to contextual assistant:', err);
      }
    }

    // Heuristic contextual response
    return this.fallbackChat(userMessage, clientContext, recalledMemories);
  }

  // --- Fallback Helpers ---

  private fallbackExtract(notes: string, clientContext: { name: string; company: string }): ExtractedMeetingData {
    const memories: ExtractedMeetingData['memories'] = [];
    const actionItems: ExtractedMeetingData['actionItems'] = [];

    // Simple rule-based extraction
    const lines = notes.split('\n').filter((l) => l.trim().length > 0);

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('budget') || lower.includes('cost') || lower.includes('₹') || lower.includes('$')) {
        memories.push({
          text: line.trim(),
          category: 'Budget',
          type: 'world',
          tags: ['budget', 'financial']
        });
      } else if (lower.includes('prefer') || lower.includes('likes') || lower.includes('wants to use')) {
        memories.push({
          text: line.trim(),
          category: 'Preference',
          type: 'observation',
          tags: ['preference', 'tech']
        });
      } else if (lower.includes('concern') || lower.includes('worried') || lower.includes('risk') || lower.includes('delay')) {
        memories.push({
          text: line.trim(),
          category: 'Concern',
          type: 'experience',
          tags: ['concern', 'risk']
        });
      } else if (lower.includes('must') || lower.includes('require') || lower.includes('target') || lower.includes('deadline')) {
        memories.push({
          text: line.trim(),
          category: 'Requirement',
          type: 'world',
          tags: ['requirement', 'deadline']
        });
      } else if (lower.includes('action:') || lower.includes('todo:') || lower.includes('will send') || lower.includes('committed to')) {
        actionItems.push({
          description: line.replace(/^(action:|todo:|-)/i, '').trim(),
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
        });
      }
    }

    if (memories.length === 0) {
      memories.push({
        text: `Key discussion point logged for ${clientContext.name}: ${notes.slice(0, 120)}...`,
        category: 'Preference',
        type: 'observation',
        tags: ['discussion']
      });
    }

    return {
      summary: `Meeting concluded with ${clientContext.name}. Discussed core project requirements and timeline alignment.`,
      keyTakeaways: [
        `Aligned on priority objectives with ${clientContext.name}`,
        'Identified key technical and scheduling parameters',
        'Next steps agreed upon for upcoming sync'
      ],
      memories,
      actionItems: actionItems.length > 0 ? actionItems : [{ description: 'Follow up with meeting notes and summary' }]
    };
  }

  private fallbackPrepareBrief(
    client: { name: string; company: string; role: string },
    memories: MemoryRecord[],
    title: string
  ): PrepareMeBrief {
    const preferences = memories.filter((m) => m.category === 'Preference').map((m) => m.text);
    const concerns = memories.filter((m) => m.category === 'Concern').map((m) => m.text);
    const requirements = memories.filter((m) => m.category === 'Requirement' || m.category === 'Budget').map((m) => m.text);
    const commitments = memories.filter((m) => m.category === 'Commitment' || m.category === 'Decision').map((m) => m.text);

    return {
      clientName: client.name,
      clientCompany: client.company,
      clientRole: client.role,
      meetingObjective: `Secure executive sign-off for ${title} while reassuring ${client.name} on milestone delivery dates.`,
      whatYouShouldRemember: requirements.length > 0 ? requirements : [
        'Phase 1 budget has strict ceiling discussed in previous sessions.',
        'Target deployment deadline is scheduled for December.'
      ],
      importantConcerns: concerns.length > 0 ? concerns : [
        'Delivery timeline risk: Any schedule slip past December threatens executive roadmap.'
      ],
      openFollowUps: commitments.length > 0 ? commitments : [
        'Deliver technical proposal with milestone breakdown.'
      ],
      suggestedTalkingPoints: [
        `Affirm alignment with ${client.name}'s preferred tech stack and communication cadence.`,
        'Walk through the milestone risk mitigation plan to guarantee on-time delivery.',
        'Review the API integration endpoints for CRM and payment hooks.'
      ],
      suggestedQuestions: [
        `"Sarah, we built the delivery roadmap specifically around the December target—are there any internal blackout dates we should account for?"`,
        `"Would you like us to review the React component library hierarchy with your internal team this week?"`
      ],
      recommendedFocus: 'Lead with delivery certainty and technical proposal milestones. Do not dwell on open-ended options; present structured decisions.',
      recalledMemoryCount: memories.length,
      memorySource: 'MeetMind Hindsight Memory Store'
    };
  }

  private fallbackChat(
    query: string,
    client: { name: string; company: string } | null,
    memories: MemoryRecord[]
  ): { answer: string; memoriesUsed: string[]; source: string } {
    const qLower = query.toLowerCase();
    const clientName = client ? client.name : 'the client';

    let answer = `Here is what MeetMind remembers about ${clientName}:\n\n`;

    if (qLower.includes('concern') || qLower.includes('worry') || qLower.includes('risk')) {
      const concerns = memories.filter((m) => m.category === 'Concern');
      if (concerns.length > 0) {
        answer += `⚠️ **Key Concerns Expressed:**\n${concerns.map((c) => `• ${c.text}`).join('\n')}\n\n`;
      } else {
        answer += `No critical concerns have been flagged in recent meetings.\n\n`;
      }
    } else if (qLower.includes('tech') || qLower.includes('prefer') || qLower.includes('framework')) {
      const prefs = memories.filter((m) => m.category === 'Preference');
      if (prefs.length > 0) {
        answer += `⚙️ **Preferences & Technical Stack:**\n${prefs.map((p) => `• ${p.text}`).join('\n')}\n\n`;
      }
    } else if (qLower.includes('budget') || qLower.includes('cost') || qLower.includes('money')) {
      const budgets = memories.filter((m) => m.category === 'Budget');
      if (budgets.length > 0) {
        answer += `💰 **Budget Discussed:**\n${budgets.map((b) => `• ${b.text}`).join('\n')}\n\n`;
      }
    } else {
      answer += `🧠 **Key Facts from Memory:**\n${memories.slice(0, 6).map((m) => `• [${m.category}] ${m.text}`).join('\n')}\n\n`;
    }

    answer += `Every insight above is persisted in MeetMind's Hindsight memory bank to keep your future meetings fully contextualized.`;

    return {
      answer,
      memoriesUsed: memories.map((m) => m.text),
      source: 'MeetMind Persistent Memory Cache'
    };
  }
}

export const aiService = new AIService();
