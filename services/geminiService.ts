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

  if (message.includes('404')) {
    return "The requested AI model was not found. Please try again or contact support.";
  }

  return message;
};

// Use the recommended model alias from the skill
const MODEL_NAME = 'gemini-3-flash-preview';

export const getAnswerFromGemini = async (question: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'API key is not configured. Please ensure GEMINI_API_KEY is set.';
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: question,
        config: {
          systemInstruction: "You are an elite AI Mentor for Indian Government Exam preparation (UPSC, SSC, Banking, State PSC). Your mission is to provide the most authoritative, detailed, and pedagogically sound explanations possible.\n\n**RESPONSE STANDARDS:**\n- **Depth**: Go beyond surface-level facts. Explain 'Why' and 'How'.\n- **Structure**: Use the mandatory sections below.\n- **Precision**: Use exact administrative terms, constitutional articles, and economic theories.\n- **Pedagogy**: Use analogies to explain complex concepts.\n\n**MANDATORY RESPONSE STRUCTURE:**\n1. 📌 **Quick Strategy**: A 2-sentence executive summary for rapid revision.\n2. 📖 **Concept Deep-Dive**: Detailed explanation with **bolded keywords**. Use sub-headings for clarity.\n3. ⚖️ **Critical Analysis (UPSC Perspective)**: Discuss pros/cons, implications, or legal significance.\n4. ⚡ **SSC/PSC One-Liners**: Bulleted list of high-yield facts (Dates, Names, Locations).\n5. 🎯 **Exam Relevance & PYQ Patterns**: Mention which year/exam similar questions appeared and the level of importance.\n6. 📚 **Must-Know Terminology**: Definitions of technical terms used in the explanation.\n7. 🔗 **Integrated Learning**: Connect this topic with other subjects (e.g., History with Polity).\n8. 📝 **Practice MCQ Batch**: Exactly 2 high-quality MCQ with detailed answer justifications.\n\n**Formatting Guidelines:**\n- Use clear Markdown headers (##, ###).\n- **Strict bolding** of dates, names, and crucial data.\n- Professional and encouraging tone."
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
        const prompt = `Act as an expert examiner for **${exam}**. Generate a high-quality assessment with exactly ${count} questions on the topic: "${topic}" at a **${difficulty}** level. 
        
        **Quality Guidelines:**
        1. **Distractors**: Options must be plausible "traps" that test deep understanding, not just obvious wrong answers.
        2. **Logical Reasoning**: Include questions that require conceptual application, not just rote memorization.
        3. **Explanation Quality**: The explanation MUST include: 
           - Why the correct option is right.
           - Why the other options are wrong (Elimination technique).
           - The core concept or Article/Section/Formula involved.
        4. **Extra Edge Facts**: Provide 2-3 "Must-Remember" data points related to the question that appear frequently in PYQs (Previous Year Questions).`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
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
        
        const text = response.text;
        if (!text) {
             throw new Error('Empty response from AI.');
        }

        try {
            return JSON.parse(text) as QuizResponse;
        } catch (parseError) {
            console.error('JSON Parse Error. Raw text:', text);
            throw new Error('Analysis synthesis failed format validation. Please try again.');
        }

    } catch (error: any) {
        throw new Error(`${formatAiError(error)}`);
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
      model: MODEL_NAME,
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
      model: MODEL_NAME,
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
            model: MODEL_NAME,
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
        const prompt = `Analyze the provided text and synthesize ${count} high-quality, exam-standard MCQs. 
        
        **Requirements:**
        - **Question Focus**: Target the most exam-relevant portions of the text.
        - **Distractors**: Create high-quality distractors that require precise knowledge.
        - **Detailed Solution**: Each explanation MUST explain the logic, link back to the text, and provide tips for similar questions.
        - **Strategic Facts**: Include 'Extra Edge' items that expand on the text's data.
        
        TEXT: ${text}`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
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
            model: MODEL_NAME,
            contents: [{ parts: [...imageParts, textPart] }],
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
        const prompt = `Extract core examination concepts from these study materials (handwritten or digital) and generate ${count} high-standard MCQs.
        
        **Guidelines:**
        - **Multimodal Accuracy**: Specifically focus on dates, names, and diagrams if present.
        - **Competitive Standard**: Questions should be at the level of UPSC/SSC CGL.
        - **Deep Explanation**: Provide a masterclass explanation for each answer, including context not explicitly in the notes.
        - **Fact Linkage**: Add 2-3 related facts for active recall.
        
        Output in professional English JSON format.`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ parts: [...imageParts, { text: prompt }] }],
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
    let prompt = `Act as a Senior Intelligence Officer for Indian Government Exams (UPSC, SSC, Banking). Provide a comprehensive briefing of 10 recent and high-standard current affairs articles on the topic: "${topic}".`;

    if (date) {
      prompt += ` Focus primarily on events that occurred within this timeframe: ${date}.`;
    }
    
    if (exam && exam !== 'All Exams') {
        prompt += ` The analysis MUST be tailored for the **${exam}** exam, integrating syllabus-specific keywords (e.g., specific GS papers for UPSC).`
    }

    prompt += `
    
    **Editorial Standards:**
    - **Title**: Impactful and factual headline.
    - **Summary**: Concise 2-sentence executive summary.
    - **Detailed Analysis**: Explain the 'Why' and the 'Strategic Impact' (Economic, Geopolitical, Social).
    - **Exam Relevance**: Explicitly map the event to the exam syllabus (e.g., "GS-II: International Relations", "Economy: Banking Sector Reforms").
    - **Category**: Classify into National, International, Economy, Sci-Tech, or Sports.
    - **Date**: The exact date of the event in readable format.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
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
      model: MODEL_NAME,
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
    const prompt = `Provide an in-depth expansion for the following GK/Current Affairs fact for competitive exams: "${fact}".
    
    The response must include:
    1. A detailed but concise explanation of the fact.
    2. 3-4 'Quick Takeaways' for active recall.
    3. 2-3 Related concepts or constitutional articles/sections if applicable.
    
    Structure the response as a JSON object.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
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
