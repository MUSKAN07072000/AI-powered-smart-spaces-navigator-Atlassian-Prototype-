
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { Space, Team, Issue, Document } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder for environments where the key might not be set.
  // In a real build process, this would likely cause a failure.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const searchResultSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      type: { type: Type.STRING, enum: ['space', 'team', 'issue', 'document'] },
      title: { type: Type.STRING },
      summary: { type: Type.STRING, description: 'A brief, 1-2 sentence summary of why this result is relevant to the query.' },
      relevance: { type: Type.NUMBER, description: 'A score from 0 to 100 indicating relevance.' },
    },
    required: ['id', 'type', 'title', 'summary', 'relevance'],
  },
};

export const performSmartSearch = async (query: string, contextData: { spaces: Space[], teams: Team[], issues: Issue[], documents: Document[] }) => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an AI-powered search engine for an Atlassian workspace. Your task is to find the most relevant items based on the user's query.
    
    Search Query: "${query}"

    Searchable Data:
    - Spaces: ${JSON.stringify(contextData.spaces.map(s => ({ id: s.id, name: s.name, description: s.description, key: s.key })))}
    - Teams: ${JSON.stringify(contextData.teams)}
    - Issues: ${JSON.stringify(contextData.issues.map(i => ({ id: i.id, key: i.key, title: i.title, status: i.status })))}
    - Documents: ${JSON.stringify(contextData.documents.map(d => ({ id: d.id, title: d.title, content: d.content.substring(0, 50) + '...' })))}

    Analyze the query and the provided data. Return a JSON array of the most relevant results, up to a maximum of 10. For each result, provide the ID, type, title, a summary explaining its relevance, and a relevance score.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: searchResultSchema,
        temperature: 0.1,
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API for search:", error);
    throw new Error("Failed to perform smart search.");
  }
};


export const getAiSuggestions = async (context: { role: string, recentActivity: string }) => {
    const model = "gemini-2.5-flash";
    const prompt = `
        Based on the user's context, provide 2-3 concise, actionable suggestions for what they might want to do next in their Atlassian workspace. Return a simple JSON array of strings.

        User Context:
        - Role: ${context.role}
        - Recent Activity: ${context.recentActivity}

        Example output: ["Review the Q4 research goals document", "Check the status of PHX-102"]
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for suggestions:", error);
        throw new Error("Failed to fetch AI suggestions.");
    }
};

export const initChat = (): Chat => {
    const model = "gemini-2.5-flash";
    return ai.chats.create({
        model,
        config: {
            systemInstruction: "You are a helpful and friendly Atlassian workspace assistant. You help users find information, understand project status, and navigate their workspace. You have access to context about spaces, teams, issues, and documents. Be concise and helpful.",
            temperature: 0.7,
        }
    });
};

export async function* streamChatResponse(chat: Chat, message: string, contextData: { spaces: Space[], teams: Team[], issues: Issue[], documents: Document[] }) {
    const prompt = `
        User message: "${message}"

        Here is the workspace data you can use to answer the user's question. Do not mention that you are using this data unless the user asks how you know something.
        
        Workspace Context:
        - Spaces: ${JSON.stringify(contextData.spaces.map(s => ({ id: s.id, name: s.name, description: s.description, key: s.key })))}
        - Teams: ${JSON.stringify(contextData.teams)}
        - Issues: ${JSON.stringify(contextData.issues.map(i => ({ id: i.id, key: i.key, title: i.title, status: i.status })))}
        - Documents: ${JSON.stringify(contextData.documents.map(d => ({ id: d.id, title: d.title })))}
    `;

    try {
        const stream = await chat.sendMessageStream({ message: prompt });
        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error streaming chat response from Gemini:", error);
        yield "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
}
