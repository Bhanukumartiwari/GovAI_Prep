import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize the GoogleGenAI client as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAnswerFromGemini = async (question: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Fix: Call the Gemini API to generate content for a given question.
    const response = await ai.models.generateContent({
        model: model,
        contents: question,
        config: {
            systemInstruction: "You are an expert AI assistant for Indian government exam preparation (like UPSC, SSC, etc.). Your answers must be clear, concise, and accurate. Structure your responses for easy student comprehension. **Crucially, highlight all important keywords, names, dates, and concepts by enclosing them in double asterisks (e.g., **keyword**).** Use Markdown for headings and bullet points where appropriate."
        }
    });
    
    // Fix: Extract the text from the response as per guidelines.
    return response.text;

  } catch (error) {
    console.error('Error fetching answer from Gemini:', error);
    return 'An error occurred while fetching the answer. Please try again.';
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
        const model = 'gemini-2.5-flash';
        const prompt = `Generate a multiple-choice quiz with ${count} questions on the topic: "${topic}". The questions should be relevant for the **${exam}** exam with a **${difficulty}** difficulty level. For each question, provide 4 options (A, B, C, D) and indicate the correct answer key (e.g., "A").`;

        // Fix: Call the Gemini API to generate a quiz in JSON format using a response schema.
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
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as QuizResponse;

    } catch (error) {
        console.error('Error generating quiz:', error);
        throw new Error('Failed to generate the quiz. The AI might not be able to create a quiz for this specific topic.');
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
    const model = 'gemini-2.5-flash';
    const prompt = `
      Create a detailed and actionable study plan for a student preparing for the **${exam}** exam.

      **Student Profile:**
      - **Target Exam:** ${exam}
      - **Subjects to Cover:** ${subjects}
      - **Total Preparation Duration:** ${duration}
      - **Available Study Time:** ${dailyHours} hours per day

      **Instructions for the Plan:**
      1.  **Structure:** Organize the plan into a weekly schedule for the entire duration.
      2.  **Daily Breakdown:** For each week, provide a day-by-day breakdown (Monday to Sunday).
      3.  **Task Allocation:** Assign specific topics or tasks for each study session. Balance new topics with revision.
      4.  **Practicality:** The plan must be realistic and sustainable for the specified daily hours.
      5.  **Revisions & Mocks:** Incorporate regular revision sessions (daily, weekly) and mock tests (e.g., weekly or bi-weekly, especially towards the end of the plan).
      6.  **Formatting:** Use Markdown for clear presentation. 
          - Use a main heading for the plan title (e.g., '# Study Plan for ${exam}').
          - Use second-level headings for each week (e.g., '## Week 1: Foundation Building').
          - Use bullet points for daily tasks.
          - Use bold formatting for important keywords, subjects, or actions (e.g., **Revision**, **Mock Test**).

      Generate the study plan now.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic counselor and exam strategist specializing in Indian government examinations. Your goal is to create highly effective, personalized, and motivating study plans."
      }
    });

    return response.text;
  } catch (error) {
    console.error('Error generating study plan:', error);
    return 'An error occurred while generating the study plan. Please try again.';
  }
};

export const getExamInfo = async (exam: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Provide a comprehensive overview for the **${exam}** examination. The information should be accurate, up-to-date, and well-structured for an aspiring student.

      **Instructions:**
      1.  **Format:** Use Markdown for clear, hierarchical presentation.
      2.  **Main Heading:** Start with a main heading for the exam name (e.g., '# Overview of ${exam} Exam').
      3.  **Sections:** Include the following distinct sections, using second-level headings (e.g., '## Tentative Exam Dates'):
          - **Tentative Exam Dates:** Mention key dates like notification release, application window, and exam dates for different stages (Prelims, Mains, etc.). State that these are tentative and subject to official notifications.
          - **Exam Pattern:** Detail the structure of the exam. For each stage (e.g., Prelims, Mains, Interview), describe the mode (online/offline), duration, number of papers/subjects, total marks, and type of questions (MCQ/descriptive). Use tables if it enhances clarity.
          - **Detailed Syllabus:** Provide a subject-wise syllabus breakdown for each stage of the exam. Use nested bullet points for topics and sub-topics to create a clear and easy-to-read structure.
      4.  **Highlighting:** Use bold formatting (**...**) to highlight important terms, subjects, and key numbers.

      Generate the exam information now.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI assistant specializing in Indian government examinations. Your primary function is to provide accurate and structured information about exam patterns, syllabi, and dates."
      }
    });

    return response.text;
  } catch (error) {
    console.error('Error generating exam info:', error);
    return 'An error occurred while generating the exam information. Please try again.';
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
    const model = 'gemini-2.5-flash';
    let prompt = `Provide a list of 5 recent and important current affairs articles on the topic: "${topic}".`;

    if (date) {
      prompt += ` Focus on events that occurred around or on this date: ${date}.`;
    }
    
    if (exam && exam !== 'All Exams') {
        prompt += ` The information should be highly relevant for aspirants of the **${exam}** exam.`
    } else {
        prompt += ` The information should be relevant for Indian government exam aspirants in general.`
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

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as CurrentAffairsResponse;
    
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    throw new Error('Failed to fetch and parse current affairs from the AI. The format might be unexpected. Please try a different topic.');
  }
};