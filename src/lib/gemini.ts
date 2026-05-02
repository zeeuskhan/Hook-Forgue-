import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedHooks {
  viral: string[];
  curiosity: string[];
  emotional: string[];
  shocking: string[];
  storytelling: string[];
}

export async function generateHooks(topic: string, tone: string, platform: string): Promise<GeneratedHooks> {
  const prompt = `You are a world-class YouTube scriptwriter, viral content strategist, and expert in viewer psychology with deep knowledge of attention retention, scroll-stopping content, and platform-specific engagement patterns.

USER INPUT
Topic/Niche: ${topic}
Tone: ${tone}
Platform: ${platform}

YOUR TASK
Generate exactly 20 high-impact, scroll-stopping hooks for the topic above, divided into 5 psychology-driven categories. Every hook must feel like it was written by a top human creator — not an AI. Every hook must be under 30 words. Every hook must be specific to the topic, not generic.

PSYCHOLOGY FRAMEWORK TO APPLY
Apply one or more of these psychological triggers to EVERY single hook:
1. CURIOSITY GAP — Make the viewer feel they are missing critical, life-changing, or surprising information.
2. FOMO (Fear Of Missing Out) — Make them feel that not watching means losing money, opportunity, time, status, or knowledge.
3. PATTERN INTERRUPT — Start with something unexpected, counterintuitive, or paradoxical.
4. SOCIAL PROOF + AUTHORITY — Use scale, numbers, success stories, or expert consensus to create credibility.
5. URGENCY + HIGH STAKES — Create a sense that the window is closing or the cost of inaction is high.
6. NARRATIVE LOOP (for Storytelling hooks) — Open a story that cannot psychologically be left incomplete.
7. DIRECT CHALLENGE (for Aggressive tone) — Challenge the viewer's current belief, behavior, or identity directly.

PLATFORM-SPECIFIC RULES
If Platform = YouTube (long-form): Hooks can be slightly longer (20-30 words). Can include setup + payoff.
If Platform = YouTube Shorts: Maximum 15 words. Hit in the first two words.
If Platform = Instagram Reels: Under 12 words ideal.

ABSOLUTE RULES
- NEVER start with "In this video...", "Today I will...", etc.
- NEVER be vague or generic.
- Match the energy of ${tone}.
- Optimize length for ${platform}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          viral: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "10 viral hooks that feel like they could trend"
          },
          curiosity: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 hooks creating a curiosity gap"
          },
          emotional: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 hooks triggering empathy or connection"
          },
          shocking: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 hooks using surprising facts or stats"
          },
          storytelling: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 hooks opening a narrative loop"
          }
        },
        required: ["viral", "curiosity", "emotional", "shocking", "storytelling"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text.trim()) as GeneratedHooks;
}
