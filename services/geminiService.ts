
import { GoogleGenAI, Type } from "@google/genai";

export const getAnswerFromGemini = async (question: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    
    const response = await ai.models.generateContent({
        model: model,
        contents: question,
        config: {
            systemInstruction: "You are an expert AI assistant for Indian government exam preparation (like UPSC, SSC, etc.). Your answers must be clear, concise, and accurate. Structure your responses for easy student comprehension. **Crucially, highlight all important keywords, names, dates, and concepts by enclosing them in double asterisks (e.g., **keyword**).** Use Markdown for headings and bullet points where appropriate."
        }
    });
    
    return response.text || 'The AI was unable to generate a response. Please try rephrasing your question.';

  } catch (error) {
    console.error('Error fetching answer from Gemini:', error);
    return 'An error occurred while fetching the answer. Please ensure your API key is correctly configured in your environment.';
  }
};

export interface QuizQuestion {
    question: string;
    options: { A: string; B: string; C: string; D: string };
    answer: string;
}

export interface QuizResponse {
    quiz: QuizQuestion[];
}


export const generateMcqQuiz = async (topic: string, count: number, exam: string, difficulty: string): Promise<QuizResponse> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-3-flash-preview';
        const prompt = `Generate a multiple-choice quiz with ${count} questions on the topic: "${topic}". The questions should be relevant for the **${exam}** exam with a **${difficulty}** difficulty level. For each question, provide 4 options (A, B, C, D) and indicate the correct answer key (e.g., "A").`;

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
                                    answer: { type: Type.STRING, description: "The correct option key (A, B, C, or D)." }
                                },
                                required: ["question", "options", "answer"]
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
        throw new Error('Failed to generate the quiz. Please check your network connection or API configuration.');
    }
}

export interface StudyPlanParams {
  exam: string;
  subjects: string;
  duration: string;
  dailyHours: string;
}

export const generateStudyPlan = async ({ exam, subjects, duration, dailyHours }: StudyPlanParams): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    const prompt = `
      Create a detailed and actionable study plan for a student preparing for the **${exam}** exam.

      **Student Profile:**
      - **Target Exam:** ${exam}
      - **Subjects to Cover:** ${subjects}
      - **Total Preparation Duration:** ${duration}
      - **Available Study Time:** ${dailyHours} hours per day

      **Instructions for the Plan:**
      1.  **Structure:** Organize the plan into a weekly schedule for the entire duration.
      2.  **Daily Breakdown:** For each week, provide a day-by-day breakdown.
      3.  **Task Allocation:** Assign specific topics or tasks for each study session. Balance new topics with revision.
      4.  **Practicality:** The plan must be realistic and sustainable for the specified daily hours.
      5.  **Revisions & Mocks:** Incorporate regular revision sessions and mock tests.
      6.  **Formatting:** Use Markdown for clear presentation.

      Generate the study plan now.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic counselor and exam strategist specializing in Indian government examinations. Your goal is to create highly effective, personalized, and motivating study plans."
      }
    });

    return response.text || 'Could not generate study plan.';
  } catch (error) {
    console.error('Error generating study plan:', error);
    return 'An error occurred while generating the study plan. Please check if your API key is correctly set.';
  }
};

export const getExamInfo = async (exam: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Provide a comprehensive overview for the **${exam}** examination. Include Tentative Exam Dates, Exam Pattern, and a Subject-wise Syllabus breakdown.
      Use Markdown for clear, hierarchical presentation. Highlight important terms using bold formatting.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI assistant specializing in Indian government examinations. Your primary function is to provide accurate and structured information about exam patterns, syllabi, and dates."
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
  date: string;
  category: string;
}

export interface CurrentAffairsResponse {
  articles: NewsItem[];
}

export const getCurrentAffairs = async (topic: string, date?: string, exam?: string): Promise<CurrentAffairsResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
                  date: { type: Type.STRING, description: "The approximate date of the event or article." },
                  category: { type: Type.STRING, description: "A relevant category (e.g., Polity, Economy, Science & Tech, National, International)." }
                },
                required: ["title", "summary", "date", "category"]
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
