
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key || key === 'undefined' || key === 'null') {
    return '';
  }
  return key;
};

export const getAnswerFromGemini = async (question: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'API key is not configured. Please ensure GEMINI_API_KEY is set.';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use gemini-flash-latest for stability and broad availability
    const model = 'gemini-flash-latest';
    
    const response = await ai.models.generateContent({
        model: model,
        contents: question,
        config: {
            systemInstruction: "You are an expert AI assistant for Indian government exam preparation (like UPSC, SSC, etc.). Your answers must be comprehensive and accurate. Structure your responses for easy student comprehension. **Crucially, highlight all important keywords, names, dates, and concepts by enclosing them in double asterisks (e.g., **keyword**).** Use Markdown for headings and bullet points. Always include a section for 'Key Facts' and 'Additional Context' related to the question to help with broader exam preparation."
        }
    });
    
    return response.text || 'The AI was unable to generate a response.';

  } catch (error: any) {
    console.error('Error fetching answer from Gemini:', error);
    return `An error occurred: ${error?.message || 'Failed to fetch answer.'}`;
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
        const model = 'gemini-flash-latest';
        const prompt = `Generate a multiple-choice quiz with ${count} questions on the topic: "${topic}". The questions should be relevant for the **${exam}** exam with a **${difficulty}** difficulty level. For each question, provide 4 options (A, B, C, D), indicate the correct answer key (e.g., "A"), provide a brief clear explanation, and list 2-3 additional 'related facts' or 'important pointers' that are relevant to this specific topic/question for competitive exams.`;

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
        console.error('Error generating quiz:', error);
        throw new Error(`Failed to generate quiz: ${error?.message}`);
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
    const model = 'gemini-flash-latest';
    const prompt = `Create an extremely detailed, actionable, and comprehensive study plan for a student preparing for the **${exam}** exam with these subjects: ${subjects}. Duration: ${duration}. Daily hours: ${dailyHours}. Use Markdown.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic counselor for Indian exams."
      }
    });

    return response.text || 'Could not generate study plan.';
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    return `Error: ${error?.message}`;
  }
};

export const getExamInfo = async (exam: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return 'API key is not configured.';

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-flash-latest';
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
    console.error('Error fetching exam info:', error);
    return `Error: ${error?.message || 'Failed to fetch information.'}`;
  }
};

export const analyzeDocument = async (text: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return 'API Key is missing.';

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-flash-latest';
        const prompt = `Analyze and summarize this study material text. Extract key concepts, dates, names, and formulas. Use Markdown. TEXT: ${text}`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are an expert study material analyzer."
            }
        });

        return response.text || 'Could not analyze document.';
    } catch (error: any) {
        console.error('Error analyzing document:', error);
        return `Error: ${error?.message}`;
    }
};

export const generateQuestionsFromText = async (text: string, count: number = 5): Promise<QuizResponse> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API Key is missing.');

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-flash-latest';
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
        console.error('Error generating questions from text:', error);
        throw new Error(`Failed to generate questions: ${error?.message}`);
    }
};

export const analyzeDocumentMultimodal = async (imageParts: { inlineData: { data: string; mimeType: string } }[]): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return 'API Key is missing.';

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-flash-latest';
        
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
        console.error('Error analyzing document multimodal:', error);
        return `Error: ${error?.message || 'Failed to analyze document.'}`;
    }
};

export const generateQuestionsFromMultimodal = async (imageParts: { inlineData: { data: string; mimeType: string } }[], count: number = 5): Promise<QuizResponse> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API Key is missing.');

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-flash-latest';
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
        console.error('Error generating questions from multimodal:', error);
        throw new Error(`Failed to generate questions: ${error?.message}`);
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
    const model = 'gemini-flash-latest';
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
    console.error('Error fetching current affairs:', error);
    throw new Error(`Failed to fetch current affairs: ${error?.message}`);
  }
};
