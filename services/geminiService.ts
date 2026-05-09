
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key || key === 'undefined') {
    console.error('Gemini API key is missing. Please set GEMINI_API_KEY in your environment variables.');
    return '';
  }
  return key;
};

export const getAnswerFromGemini = async (question: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'API key is not configured. If you are on Vercel, please add GEMINI_API_KEY to your Environment Variables.';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3.1-pro-preview';
    
    const response = await ai.models.generateContent({
        model: model,
        contents: question,
        config: {
            systemInstruction: "You are an expert AI assistant for Indian government exam preparation (like UPSC, SSC, etc.). Your answers must be comprehensive and accurate. Structure your responses for easy student comprehension. **Crucially, highlight all important keywords, names, dates, and concepts by enclosing them in double asterisks (e.g., **keyword**).** Use Markdown for headings and bullet points. Always include a section for 'Key Facts' and 'Additional Context' related to the question to help with broader exam preparation."
        }
    });
    
    return response.text || 'The AI was unable to generate a response. Please try rephrasing your question.';

  } catch (error) {
    console.error('Error fetching answer from Gemini:', error);
    return 'An error occurred while fetching the answer. Please ensure your Gemini API key is correctly configured and has sufficient quota.';
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
    if (!apiKey) {
        throw new Error('API key is not configured. Please add GEMINI_API_KEY to your environment.');
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-3-flash-preview';
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
                            description: "An array of quiz questions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING, description: "The question text." },
                                    options: {
                                        type: Type.OBJECT,
                                        properties: {
                                            A: { type: Type.STRING },
                                            B: { type: Type.STRING },
                                            C: { type: Type.STRING },
                                            D: { type: Type.STRING },
                                        },
                                        required: ["A", "B", "C", "D"],
                                        description: "The multiple choice options."
                                    },
                                    answer: { type: Type.STRING, description: "The correct option key (A, B, C, or D)." },
                                    explanation: { type: Type.STRING, description: "A brief explanation of the correct answer." },
                                    relatedFacts: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "A list of related facts or pointers for extra learning."
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

    } catch (error) {
        console.error('Error generating quiz:', error);
        throw new Error('Failed to generate the quiz. Please check your API configuration or quota.');
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
  if (!apiKey) {
    return 'API key is not configured. Please add GEMINI_API_KEY to your environment.';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3.1-pro-preview';
    const prompt = `
      Create an extremely detailed, actionable, and comprehensive study plan for a student preparing for the **${exam}** exam.

      **Student Profile:**
      - **Target Exam:** ${exam}
      - **Subjects to Cover:** ${subjects}
      - **Total Preparation Duration:** ${duration}
      - **Available Study Time:** ${dailyHours} hours per day

      **Instructions for the Plan:**
      1.  **Structure:** Organize the plan into a weekly schedule for the entire duration.
      2.  **Daily Breakdown:** For each week, provide a day-by-day breakdown with specific sessions.
      3.  **Task Allocation:** Assign specific topics or tasks for each study session. Balance new topics with revision.
      4.  **Practicality:** The plan must be realistic and sustainable.
      5.  **Revisions & Mocks:** Incorporate regular revision sessions and mock tests.
      6.  **Formatting:** Use Markdown for clear presentation.
      7.  **Additional Sections:** 
          - **Expert Preparation Tips:** Specific strategies for this exam.
          - **Recommended Resources:** Types of books, websites, or materials to use.
          - **Mindset & Motivation:** Advice on staying consistent.

      Generate the comprehensive study plan now.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic counselor and exam strategist specializing in Indian government examinations. Your goal is to create highly effective, personalized, and motivating study plans with detailed explanations for every strategy."
      }
    });

    return response.text || 'Could not generate study plan.';
  } catch (error) {
    console.error('Error generating study plan:', error);
    return 'An error occurred while generating the study plan. Please check your API key.';
  }
};

export const getExamInfo = async (exam: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'API key is not configured.';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Provide a highly detailed and comprehensive overview for the **${exam}** examination. 
      Include:
      1. **Tentative Exam Dates** (Prelims, Mains, Interview where applicable).
      2. **In-depth Exam Pattern** (No. of papers, marks, duration, negative marking).
      3. **Subject-wise Syllabus** (Detailed breakdown of topics).
      4. **Success Strategy** (Top 5 tips to crack this exam).
      5. **Recommended Resources** (Standard books and online portals).
      
      Use Markdown for clear, hierarchical presentation. Highlight important terms using bold formatting.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI assistant specializing in Indian government examinations. Your primary function is to provide accurate, highly detailed, and structured information about exam patterns, syllabi, and success strategies."
      }
    });

    return response.text || 'Information not available.';
  } catch (error) {
    console.error('Error generating exam info:', error);
    return 'An error occurred while fetching exam information.';
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
              description: "An array of current affairs articles.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "The headline of the article." },
                  summary: { type: Type.STRING, description: "A brief summary of the article (2-3 sentences)." },
                  detailedAnalysis: { type: Type.STRING, description: "A detailed explanation of the event and its background." },
                  examRelevance: { type: Type.STRING, description: "Why this event is important from an exam perspective (e.g., related to GS Paper II, etc.)." },
                  date: { type: Type.STRING, description: "The approximate date of the event or article." },
                  category: { type: Type.STRING, description: "A relevant category (e.g., Polity, Economy, Science & Tech, National, International)." }
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
    
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    throw new Error('Failed to fetch and parse current affairs. Please check your configuration.');
  }
};
