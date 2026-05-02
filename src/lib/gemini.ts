import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedHooks {
  viral: string[];
  curiosity: string[];
  emotional: string[];
  shocking: string[];
  storytelling: string[];
}

export interface GeneratedTitles {
  titles: string[];
}

export interface GeneratedDescriptions {
  description: string;
}

export interface GeneratedTags {
  tags: string[];
}

export interface GeneratedIdeas {
  ideas: {
    title: string;
    description: string;
    thumbnail: string;
  }[];
}

export interface GeneratedChannelNames {
  names: string[];
}

export interface GeneratedThumbnailIdeas {
  suggestions: {
    text: string;
    visual: string;
  }[];
}

export interface GeneratedScriptOutline {
  outline: {
    section: string;
    description: string;
    timing: string;
  }[];
}

export interface GeneratedCommentReplies {
  replies: {
    tone: string;
    text: string;
  }[];
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

export async function generateTitles(topic: string): Promise<GeneratedTitles> {
  const prompt = `Generate 10 highly clickable, viral YouTube titles for the topic: ${topic}. Focus on CTR, curiosity, and high-impact words. Use Title Case. Avoid clickbait that doesn't deliver.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["titles"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedTitles;
}

export async function generateDescriptions(topic: string, keywords: string): Promise<GeneratedDescriptions> {
  const prompt = `Write a professional, SEO-optimized YouTube video description for a video about "${topic}". Include these keywords: ${keywords}. Structure it with an engaging intro, timestamps placeholder, and relevant links/hashtags.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING }
        },
        required: ["description"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedDescriptions;
}

export async function generateTags(topic: string): Promise<GeneratedTags> {
  const prompt = `Generate 30 relevant, high-search-volume tags for a YouTube video about: ${topic}. Output as an array of strings.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["tags"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedTags;
}

export async function generateIdeas(niche: string): Promise<GeneratedIdeas> {
  const prompt = `Generate 5 viral video ideas for the ${niche} niche. For each idea, provide a clickable title, a brief concept description, and a thumbnail idea.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                thumbnail: { type: Type.STRING }
              },
              required: ["title", "description", "thumbnail"]
            }
          }
        },
        required: ["ideas"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedIdeas;
}

export async function generateChannelNames(niche: string, keywords: string): Promise<GeneratedChannelNames> {
  const prompt = `Generate 15 creative, memorable, and brandable YouTube channel names for a channel in the ${niche} niche. Use these keywords: ${keywords}. Focus on names that are easy to spell and pronounce.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          names: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["names"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedChannelNames;
}

export async function generateThumbnailIdeas(topic: string, title: string): Promise<GeneratedThumbnailIdeas> {
  const prompt = `Generate 5 creative thumbnail ideas for a YouTube video about "${topic}" with the title "${title}". For each idea, provide high-impact text overlay suggestions (max 4 words) and a description of the visual composition.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                visual: { type: Type.STRING }
              },
              required: ["text", "visual"]
            }
          }
        },
        required: ["suggestions"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedThumbnailIdeas;
}

export async function generateScriptOutline(topic: string, title: string): Promise<GeneratedScriptOutline> {
  const prompt = `Create a detailed YouTube video script outline for a video titled "${title}" about "${topic}". Break it down into sections (Intro, Hook, Body Points, Outro) with timing estimates and key points for each.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          outline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                description: { type: Type.STRING },
                timing: { type: Type.STRING }
              },
              required: ["section", "description", "timing"]
            }
          }
        },
        required: ["outline"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedScriptOutline;
}

export async function generateCommentReplies(comment: string): Promise<GeneratedCommentReplies> {
  const prompt = `Generate 3 professional and engaging replies to this YouTube comment: "${comment}". Provide one reply that is "Appreciative", one that is "Informative", and one that is "Conversational".`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          replies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["tone", "text"]
            }
          }
        },
        required: ["replies"]
      }
    }
  });

  return JSON.parse(response.text!.trim()) as GeneratedCommentReplies;
}
