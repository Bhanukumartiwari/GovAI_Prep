
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key || key === 'undefined' || key === 'null') {
    return '';
  }
  return key;
};

const formatAiError = (error: any): string => {
  console.error('Gemini API Error:', error);
  
  // Try to parse error message if it's a JSON string (common with @google/genai 429s)
  let message = error?.message || 'An unknown error occurred';
  
  try {
    if (message.includes('{')) {
      const start = message.indexOf('{');
      const end = message.lastIndexOf('}') + 1;
      const jsonPart = message.substring(start, end);
      const parsed = JSON.parse(jsonPart);
      
      if (parsed.error) {
        if (parsed.error.code === 429) {
          return "AI usage limit reached for the free tier. Please wait about 30-60 seconds and try again. The free tier has a limit of 15 requests per minute.";
        }
        return parsed.error.message || message;
      }
    }
  } catch (e) {
    // If parsing fails, fall back to default logic
  }

  if (message.includes('429') || message.toLowerCase().includes('quota')) {
    return "AI usage limit reached. Please wait about a minute before trying again.";
  }

  return message;
};

export const getAnswerFromGemini = async (question: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'API key is not configured. Please ensure GEMINI_API_KEY is set.';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use gemini-3-flash-preview for best performance and latest features
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
        model: model,
        contents: question,
        config: {
            systemInstruction: "You are an expert AI mentor for Indian government exam preparation (UPSC, SSC, Banking, State PSC). Your goal is to provide clear, accurate, and highly structured information that helps students learn faster.\n\n**Response Structure (MANDATORY):**\n1. 📌 **Quick Summary**: A concise 2-3 sentence overview.\n2. 📖 **Concept (Detailed Explanation)**: Deep dive into the topic with **bolded keywords**.\n3. ⚡ **Direct Facts (One-Liners for SSC / Railway / BSSC)**: Bulleted list of factual points.\n4. 🎯 **Exam-Specific Facts (Must-Know)**: Key takeaways for major exams.\n5. 📚 **PYQ Hint**: Information about how this topic has appeared in previous years' questions.\n6. 🔗 **Related Topics & Additional Facts**: Extra context or connected concepts.\n7. 🌐 **Historical & Current Context**: If applicable, the background and latest updates.\n8. 📝 **Practice MCQs**: 2-3 relevant multiple-choice questions with answers.\n\n**Formatting Rules:**\n- Use clear Markdown headers (##, ###).\n- **Always bold** important terms, dates, and names.\n- Use emojis at the start of each major section as shown above.\n- Ensure any tables are cleanly formatted for readability.\n- Maintain a professional, authoritative, and encouraging tone."
        }
    });
    
    return response.text || 'The AI was unable to generate a response.';
  } catch (error: any) {
    throw new Error(formatAiError(error));
  }
};

export interface QuizQuestion {
    question: string;
    options: { A: string; B: string; C: string; D: string };
    answer: string;
    explanation: string;
    relatedFacts: string[];
}

export interface QuizResponse {
    quiz: QuizQuestion[];
}


export const generateMcqQuiz = async (topic: string, count: number, exam: string, difficulty: string): Promise<QuizResponse> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API key is not configured.');

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-3-flash-preview';
        const prompt = `Generate a high-quality multiple-choice quiz with ${count} questions on the topic: "${topic}". 
        The questions must be highly relevant for the **${exam}** exam at a **${difficulty}** difficulty level. 
        
        For each question:
        1. Provide 4 distinct options (A, B, C, D).
        2. Indicate the correct answer key.
        3. Provide a clear, educational explanation that not only gives the answer but explains 'why'.
        4. List 2-3 'Extra Edge' facts related to the question that are frequently asked in competitive exams.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.OBJECT,
                                        properties: {
                                            A: { type: Type.STRING },
                                            B: { type: Type.STRING },
                                            C: { type: Type.STRING },
                                            D: { type: Type.STRING },
                                        },
                                        required: ["A", "B", "C", "D"]
                                    },
                                    answer: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                    relatedFacts: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ["question", "options", "answer", "explanation", "relatedFacts"]
                            }
                        }
                    },
                    required: ["quiz"]
                }
            }
        });
        
        const jsonStr = response.text || '{"quiz": []}';
        return JSON.parse(jsonStr) as QuizResponse;

    } catch (error: any) {
        throw new Error(`Failed to generate quiz: ${formatAiError(error)}`);
    }
}

export interface StudyPlanParams {
  exam: string;
  subjects: string;
  duration: string;
  dailyHours: string;
}

export const generateStudyPlan = async ({ exam, subjects, duration, dailyHours }: StudyPlanParams): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return 'API key is not configured.';

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const prompt = `Create a highly structured, week-by-week study plan for a student preparing for the **${exam}** exam.
    
    **Student Profile:**
    - **Subjects to Cover:** ${subjects}
    - **Preparation Horizon:** ${duration}
    - **Daily Commitment:** ${dailyHours} hours
    
    **Requirements:**
    1. Organize the plan into Weeks (Week 1, Week 2, etc.).
    2. For each week, specify the core topics, recommended resources, and a 'Weekly Goal'.
    3. Include 1 day per week for revision and 1 day for a mock test.
    4. Provide specific advice on how to integrate Current Affairs with these subjects.
    5. Use clear Markdown formatting with bold text for emphasis.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic counselor for Indian competitive exams. Your plans are realistic, motivating, and designed for maximum memory retention."
      }
    });

    return response.text || 'Could not generate study plan.';
  } catch (error: any) {
    throw new Error(formatAiError(error));
  }
};

export const getExamInfo = async (exam: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return 'API key is not configured.';

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Provide a highly detailed, student-friendly, and structured overview for the **${exam}** examination. 
      
      Structure the response using the following headers and guidelines:
      
      ## 📅 Key Exam Dates & Timeline
      (Provide a clear timeline of Prelims, Mains, and Interview dates if known, or tentative month/season).
      
      ## 📝 Exam Pattern & Marking Scheme
      (Use a markdown table or bullet points to explain papers, marks, duration, and negative marking clearly).
      
      ## 📚 Detailed Subject-wise Syllabus
      (Break down the syllabus into logical groups like General Studies, Optional, Aptitude, etc.)
      
      ## 🚀 5-Step Success Strategy
      (Provide actionable, step-by-step advice for aspirants).
      
      ## 📖 Top Recommended Resources
      (List the "Standard Books" and essential websites/portals).

      Use bold text for emphasis, bullet points for readability, and clear Markdown structure. Keep the tone encouraging and professional.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert exam counselor specializing in Indian government exams. Your goal is to make complex exam notifications easy to understand for beginners."
      }
    });

    return response.text || 'Information not available.';
  } catch (error: any) {
    throw new Error(formatAiError(error));
  }
};

export const analyzeDocument = async (text: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return 'API Key is missing.';

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-3-flash-preview';
        const prompt = `
          Analyze the following study material and provide a student-friendly summary.
          
          **Analysis Requirements:**
          1. **Key Concepts:** Identify 5-7 core concepts explained simply.
          2. **Crucial Data:** List important dates, names, figures, and formulas.
          3. **Exam Context:** Explain why this specific topic is important for exams like UPSC/SSC.
          4. **Summary Table:** Create a small Markdown table for comparing key points if applicable.
          
          TEXT: ${text}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are an expert study material analyzer who turns complex academic text into easy-to-read study notes."
            }
        });

        return response.text || 'Could not analyze document.';
    } catch (error: any) {
        throw new Error(formatAiError(error));
    }
};

export const generateQuestionsFromText = async (text: string, count: number = 5): Promise<QuizResponse> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API Key is missing.');

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-3-flash-preview';
        const prompt = `Based on this text, generate ${count} high-quality MCQs for competitive exams. Output in JSON. TEXT: ${text}`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.OBJECT,
                                        properties: {
                                            A: { type: Type.STRING },
                                            B: { type: Type.STRING },
                                            C: { type: Type.STRING },
                                            D: { type: Type.STRING }
                                        },
                                        required: ["A", "B", "C", "D"]
                                    },
                                    answer: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                    relatedFacts: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ["question", "options", "answer", "explanation", "relatedFacts"]
                            }
                        }
                    },
                    required: ["quiz"]
                }
            }
        });

        const jsonStr = response.text || '{"quiz": []}';
        return JSON.parse(jsonStr) as QuizResponse;
    } catch (error: any) {
        throw new Error(`Failed to generate questions: ${formatAiError(error)}`);
    }
};

export const analyzeDocumentMultimodal = async (imageParts: { inlineData: { data: string; mimeType: string } }[]): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return 'API Key is missing.';

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-3-flash-preview';
        
        const textPart = {
            text: `
                Analyze and summarize the following study material provided as images (handwritten notes or scanned documents).
                The notes may be in English, Hindi, or a mix of both.
                1. Perform OCR to extract the text accurately.
                2. Summarize the content, highlighting key concepts, important dates, names, and formulas. 
                3. Organize the information into clear sections using Markdown.
                4. Include a 'Key Takeaways' section at the end.
                If the text is in Hindi, provide the summary in English but include relevant Hindi terms in brackets.
            `
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [...imageParts, textPart] },
            config: {
                systemInstruction: "You are an expert handwriting and document analyzer specializing in Indian competitive exams. You can read both English and Hindi scripts fluently."
            }
        });

        return response.text || 'Could not analyze content.';
    } catch (error: any) {
        throw new Error(formatAiError(error));
    }
};

export const generateQuestionsFromMultimodal = async (imageParts: { inlineData: { data: string; mimeType: string } }[], count: number = 5): Promise<QuizResponse> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API Key is missing.');

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-3-flash-preview';
        const prompt = `Based on the attached images of study notes (potentially in English or Hindi), generate ${count} high-quality MCQs suitable for UPSC/SSC. Provide output in JSON format in English.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [...imageParts, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.OBJECT,
                                        properties: {
                                            A: { type: Type.STRING },
                                            B: { type: Type.STRING },
                                            C: { type: Type.STRING },
                                            D: { type: Type.STRING }
                                        },
                                        required: ["A", "B", "C", "D"]
                                    },
                                    answer: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                    relatedFacts: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ["question", "options", "answer", "explanation", "relatedFacts"]
                            }
                        }
                    },
                    required: ["quiz"]
                }
            }
        });

        const jsonStr = response.text || '{"quiz": []}';
        return JSON.parse(jsonStr) as QuizResponse;
    } catch (error: any) {
        throw new Error(`Failed to generate questions: ${formatAiError(error)}`);
    }
};

export interface NewsItem {
  title: string;
  summary: string;
  detailedAnalysis: string;
  examRelevance: string;
  date: string;
  category: string;
}

export interface CurrentAffairsResponse {
  articles: NewsItem[];
}

export const getCurrentAffairs = async (topic: string, date?: string, exam?: string): Promise<CurrentAffairsResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { articles: [] };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    let prompt = `Provide a list of 5 recent and important current affairs articles on the topic: "${topic}".`;

    if (date) {
      prompt += ` Focus on events that occurred around or on this date: ${date}.`;
    }
    
    if (exam && exam !== 'All Exams') {
        prompt += ` The information should be highly relevant for aspirants of the **${exam}** exam.`
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  detailedAnalysis: { type: Type.STRING },
                  examRelevance: { type: Type.STRING },
                  date: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["title", "summary", "detailedAnalysis", "examRelevance", "date", "category"]
              }
            }
          },
          required: ["articles"]
        }
      }
    });

    const jsonStr = response.text || '{"articles": []}';
    return JSON.parse(jsonStr) as CurrentAffairsResponse;
    
  } catch (error: any) {
    throw new Error(`Failed to fetch current affairs: ${formatAiError(error)}`);
  }
};

export interface DailyFeedItem {
  title: string;
  summary: string;
  context: string;
  significance?: string;
  relevance: string;
  keyFacts: string[];
  category: 'Current Affairs' | 'Static GK';
}

export interface DailyFeedResponse {
  currentAffairs: DailyFeedItem[];
  staticGk: DailyFeedItem[];
}

export const getDailyFeed = async (): Promise<DailyFeedResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { currentAffairs: [], staticGk: [] };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const prompt = `Provide the "Daily Intelligence Feed" for Indian Government Exam aspirants (UPSC, SSC, Banking) for today, ${today}.
    
    The response must follow this EXACT professional editorial style:
    - 10 News Items for "Current Affairs".
    - 10 Concept/Fact Items for "Static GK".
    
    For each item, provide:
    - 'title': A bold headline.
    - 'summary': 1-2 sentences of the core news/fact.
    - 'context': The historical or situational background (e.g., "The day commemorates...", "India suspended treaty proceedings...").
    - 'significance': (Optional) Why it matters or the deeper impact (e.g., "The backbone of India's financial inclusion drive").
    - 'relevance': Mapping to specific exams/papers (e.g., "UPSC GS-III (Science & Tech)", "SSC CGL (Modern History)").
    - 'keyFacts': A list of 3-4 "Must-Know" data points (dates, numbers, articles, names).
    
    Formatting Guidelines:
    - For Static GK, pick a high-weightage theme (like Mughal Empire, Indian Polity, Rivers of India) and provide 10 critical data units from it.
    - Style: Professional, succinct, and exam-focused.
    
    Structure the response as a JSON object with two arrays: 'currentAffairs' and 'staticGk'.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentAffairs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  context: { type: Type.STRING },
                  significance: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                  keyFacts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  category: { type: Type.STRING, enum: ["Current Affairs"] }
                },
                required: ["title", "summary", "context", "relevance", "keyFacts", "category"]
              }
            },
            staticGk: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  context: { type: Type.STRING },
                  significance: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                  keyFacts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  category: { type: Type.STRING, enum: ["Static GK"] }
                },
                required: ["title", "summary", "context", "relevance", "keyFacts", "category"]
              }
            }
          },
          required: ["currentAffairs", "staticGk"]
        }
      }
    });

    const jsonStr = response.text || '{"currentAffairs": [], "staticGk": []}';
    return JSON.parse(jsonStr) as DailyFeedResponse;
    
  } catch (error: any) {
    throw new Error(`Failed to fetch daily feed: ${formatAiError(error)}`);
  }
};

export interface FactExpansionResponse {
  fact: string;
  explanation: string;
  quickTakeaways: string[];
  relatedArticles: string[];
}

export const getFactExpansion = async (fact: string): Promise<FactExpansionResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key is not configured.');

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const prompt = `Provide an in-depth expansion for the following GK/Current Affairs fact for competitive exams: "${fact}".
    
    The response must include:
    1. A detailed but concise explanation of the fact.
    2. 3-4 'Quick Takeaways' for active recall.
    3. 2-3 Related concepts or constitutional articles/sections if applicable.
    
    Structure the response as a JSON object.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: { type: Type.STRING },
            explanation: { type: Type.STRING },
            quickTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            relatedArticles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["fact", "explanation", "quickTakeaways", "relatedArticles"]
        }
      }
    });

    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr) as FactExpansionResponse;
  } catch (error: any) {
    throw new Error(`Failed to expand fact: ${formatAiError(error)}`);
  }
};
