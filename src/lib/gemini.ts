import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // In case the define failed or env is missing
      console.error("GEMINI_API_KEY is missing. Please configure it in your environment variables.");
      // We return a dummy or throw later to avoid breaking the whole app at load time
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiInstance;
}

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

const MODEL_NAME = "gemini-3-flash-preview";

function cleanJSON(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-z]*\n/i, "").replace(/\n```$/m, "");
  }
  return cleaned.trim();
}

export async function generateHooks(topic: string, tone: string, platform: string): Promise<GeneratedHooks> {
  const ai = getAI();
  const prompt = `You are a world-class YouTube scriptwriter, viral content strategist, and expert in viewer psychology.
Topic/Niche: ${topic}
Tone: ${tone}
Platform: ${platform}

Generate exactly 20 high-impact hooks divided into 5 psychology-driven categories. Each hook must be under 30 words.
Categories: viral (10), curiosity (3), emotional (3), shocking (2), storytelling (2).`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          viral: { type: Type.ARRAY, items: { type: Type.STRING } },
          curiosity: { type: Type.ARRAY, items: { type: Type.STRING } },
          emotional: { type: Type.ARRAY, items: { type: Type.STRING } },
          shocking: { type: Type.ARRAY, items: { type: Type.STRING } },
          storytelling: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["viral", "curiosity", "emotional", "shocking", "storytelling"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedHooks;
}

export async function generateTitles(topic: string): Promise<GeneratedTitles> {
  const ai = getAI();
  const prompt = `Generate 10 highly clickable, viral YouTube titles for the topic: ${topic}. Focus on CTR and curiosity. Output exactly 10.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["titles"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedTitles;
}

export async function generateDescriptions(topic: string, keywords: string): Promise<GeneratedDescriptions> {
  const ai = getAI();
  const prompt = `Write a professional, SEO-optimized YouTube video description for a video about "${topic}". Keywords: ${keywords}. Include timestamps placeholder and hashtags.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
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

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedDescriptions;
}

export async function generateTags(topic: string): Promise<GeneratedTags> {
  const ai = getAI();
  const prompt = `Generate 30 relevant, high-search-volume tags for a YouTube video about: ${topic}.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["tags"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedTags;
}

export async function generateIdeas(niche: string): Promise<GeneratedIdeas> {
  const ai = getAI();
  const prompt = `Generate 5 viral video ideas for the ${niche} niche. Include title, concept, and thumbnail idea.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
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

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedIdeas;
}

export async function generateChannelNames(niche: string, keywords: string): Promise<GeneratedChannelNames> {
  const ai = getAI();
  const prompt = `Generate 15 creative YouTube channel names for a channel in the ${niche} niche. Keywords: ${keywords}.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          names: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["names"]
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedChannelNames;
}

export async function generateThumbnailIdeas(topic: string, title: string): Promise<GeneratedThumbnailIdeas> {
  const ai = getAI();
  const prompt = `Generate 5 creative thumbnail ideas for a YouTube video about "${topic}" (Title: "${title}"). Include text overlay and visual description.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
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

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedThumbnailIdeas;
}

export async function generateScriptOutline(topic: string, title: string): Promise<GeneratedScriptOutline> {
  const ai = getAI();
  const prompt = `Create a YouTube video script outline for "${title}" about "${topic}". Include sections with timing and description.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
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

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedScriptOutline;
}

export async function generateCommentReplies(comment: string): Promise<GeneratedCommentReplies> {
  const ai = getAI();
  const prompt = `Generate 3 professional replies to this YouTube comment: "${comment}". Tones: Appreciative, Informative, Conversational.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
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

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(cleanJSON(response.text)) as GeneratedCommentReplies;
}
