import React, { useState, useEffect, useCallback } from 'react';
import { SimulatorIcon } from '../components/icons/SimulatorIcon';
import { TimerIcon } from '../components/icons/TimerIcon';
import { Loader } from '../components/Loader';
import { generateMcqQuiz, QuizQuestion } from '../services/geminiService';
import { BackIcon } from '../components/icons/BackIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { Page } from '../App';
import { DownloadIcon } from '../components/icons/DownloadIcon';

const exams = [
  { id: 'upsc', name: 'UPSC', description: 'Union Public Service Commission exams like Civil Services, CDS, etc.' },
  { id: 'ssc', name: 'SSC', description: 'Staff Selection Commission exams like CGL, CHSL, etc.' },
  { id: 'bpsc', name: 'BPSC', description: 'Bihar Public Service Commission state-level exams.' },
  { id: 'banking', name: 'Banking', description: 'Exams for banking sector like IBPS PO, Clerk, SBI PO, etc.' },
  { id: 'railways', name: 'Railways', description: 'Railway Recruitment Board (RRB) exams like NTPC, Group D.' },
];

const subjectsByExam: Record<string, string[]> = {
  upsc: ['Indian Polity', 'Modern History', 'Geography', 'Economy'],
  ssc: ['General Awareness', 'Quantitative Aptitude', 'Reasoning', 'English'],
  bpsc: ['History of India & Bihar', 'General Science', 'Current Affairs', 'Indian Polity'],
  banking: ['Banking Awareness', 'Quantitative Aptitude', 'Reasoning Ability', 'English Language'],
  railways: ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning'],
};

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type TestState = 'selection' | 'subject_selection' | 'running' | 'finished';

interface ActiveTest {
  questions: QuizQuestion[];
  duration: number;
  name: string;
  difficulty: Difficulty;
}

interface MockTestsPageProps {
    onNavigate: (page: Page) => void;
}

export const MockTestsPage: React.FC<MockTestsPageProps> = ({ onNavigate }) => {
    const [testState, setTestState] = useState<TestState>('selection');
    const [selectedExam, setSelectedExam] = useState<(typeof exams[0]) | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [results, setResults] = useState({ score: 0, correct: 0, incorrect: 0, unanswered: 0 });

    const handleSubmit = useCallback(() => {
        if (!activeTest) return;

        let correct = 0;
        let incorrect = 0;
        
        activeTest.questions.forEach((q, index) => {
            const userAnswerKey = userAnswers[index];
            if (userAnswerKey) {
                if (userAnswerKey === q.answer) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        });
        
        const unanswered = activeTest.questions.length - (correct + incorrect);
        const score = Math.round((correct / activeTest.questions.length) * 100);

        setResults({ score, correct, incorrect, unanswered });
        setTestState('finished');
    }, [activeTest, userAnswers]);
    
    useEffect(() => {
        if (testState !== 'running') return;

        if (timeLeft <= 0) {
          handleSubmit();
          return;
        }

        const timerId = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [testState, timeLeft, handleSubmit]);


    const handleStartTest = async (subject: string, testDifficulty: Difficulty) => {
        if (!selectedExam) return;
        
        setIsLoading(true);
        setError('');
        const testConfig = {
            questions: 10,
            duration: 10 * 60, // 10 minutes
        };

        try {
            const topic = `${subject} for ${selectedExam.name}`;
            const quizData = await generateMcqQuiz(topic, testConfig.questions, selectedExam.name, testDifficulty);
            setActiveTest({ 
                questions: quizData.quiz, 
                duration: testConfig.duration, 
                name: `${selectedExam.name}: ${subject}`,
                difficulty: testDifficulty 
            });
            setTimeLeft(testConfig.duration);
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setTestState('running');
        } catch (err) {
            setError('Failed to generate the test. Please try again.');
            setTestState('subject_selection'); // Go back on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex: number, optionKey: string) => {
        setUserAnswers(prev => ({ ...prev, [questionIndex]: optionKey }));
    };

    const handleReset = () => {
        setTestState('selection');
        setActiveTest(null);
        setSelectedExam(null);
        setError('');
    };

    const handleExamSelect = (exam: typeof exams[0]) => {
        setSelectedExam(exam);
        setTestState('subject_selection');
    };
    
    const backToExamSelection = () => {
        setSelectedExam(null);
        setTestState('selection');
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDownloadResults = () => {
        if (!activeTest) return;
        
        const title = `Test Results: ${activeTest.name}`;
        
        let reportHtml = `
            <h2>Summary</h2>
            <p><strong>Overall Score:</strong> ${results.score}%</p>
            <p>
                <strong>Correct:</strong> ${results.correct} | 
                <strong>Incorrect:</strong> ${results.incorrect} | 
                <strong>Unanswered:</strong> ${results.unanswered}
            </p>
            <hr />
            <h2>Answer Review</h2>
        `;

        activeTest.questions.forEach((q, index) => {
            const userAnswerKey = userAnswers[index];
            const userAnswerText = userAnswerKey ? `${userAnswerKey}. ${q.options[userAnswerKey as keyof typeof q.options]}` : '<em>Not Answered</em>';
            const correctAnswerText = `${q.answer}. ${q.options[q.answer as keyof typeof q.options]}`;
            const isCorrect = userAnswerKey === q.answer;

            reportHtml += `
                <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
                    <p><strong>Q${index + 1}: ${q.question}</strong></p>
                    <ul>
                        <li>A: ${q.options.A}</li>
                        <li>B: ${q.options.B}</li>
                        <li>C: ${q.options.C}</li>
                        <li>D: ${q.options.D}</li>
                    </ul>
                    <p style="background-color: ${!userAnswerKey ? '#f0f0f0' : isCorrect ? '#e6fffa' : '#ffebee'}; padding: 0.5rem; border-radius: 4px;">
                        <strong>Your Answer:</strong> ${userAnswerText}
                    </p>
                    <p><strong>Correct Answer:</strong> ${correctAnswerText}</p>
                </div>
            `;
        });
        
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; padding: 2rem; color: #333; }
                        h1, h2, h3 { color: #000; }
                        strong { font-weight: 600; }
                        ul { list-style-type: none; padding-left: 0; }
                        @media print {
                            body { padding: 0; }
                            @page { margin: 1in; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${reportHtml}
                </body>
            </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
    };


    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative min-h-[300px]">
                <Loader />
            </div>
        )
    }

    if (testState === 'selection') {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => onNavigate('tools')}
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
                >
                    <BackIcon />
                    Back to Tools
                </button>
                <div className="text-center mb-12">
                     <div className="flex justify-center items-center mb-4 w-16 h-16 mx-auto bg-blue-100 rounded-full">
                        <SimulatorIcon />
                     </div>
                    <h1 className="text-4xl font-bold text-gray-900 mt-4">Mock Test Simulator</h1>
                    <p className="text-lg text-gray-600 mt-2">Choose an exam category to begin.</p>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map(exam => (
                        <div key={exam.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col hover:shadow-xl transition-shadow">
                            <h2 className="text-xl font-bold text-gray-800">{exam.name}</h2>
                            <p className="text-gray-600 mt-2 flex-grow">{exam.description}</p>
                            <button onClick={() => handleExamSelect(exam)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Select Exam</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (testState === 'subject_selection' && selectedExam) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <button
                    onClick={backToExamSelection}
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
                 >
                    <BackIcon />
                    Back to Exam Selection
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mt-4">{selectedExam.name} Mock Tests</h1>
                    <p className="text-lg text-gray-600 mt-2">Choose a subject and difficulty to start your test.</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <label htmlFor="difficulty" className="block text-md font-semibold text-gray-700 mb-2">Select Difficulty</label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <div className="space-y-4">
                        {subjectsByExam[selectedExam.id].map(subject => (
                            <button 
                                key={subject} 
                                onClick={() => handleStartTest(subject, difficulty)} 
                                className="w-full text-left p-4 bg-white rounded-lg shadow-md border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-gray-800">{subject}</span>
                                <span className="text-sm text-gray-500">10 Questions, 10 Mins</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    if (testState === 'running' && activeTest) {
        const currentQuestion = activeTest.questions[currentQuestionIndex];
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{activeTest.name}</h1>
                        <div className="flex items-center gap-2 text-red-600 font-semibold text-lg bg-red-50 px-4 py-2 rounded-lg">
                            <TimerIcon />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}></div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-lg mb-4">
                           {`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                        </p>
                        <div className="space-y-3">
                            {Object.entries(currentQuestion.options).map(([key, value]) => (
                                <label key={key} className={`flex items-center gap-3 p-3 border rounded-md transition-colors cursor-pointer ${userAnswers[currentQuestionIndex] === key ? 'bg-blue-100 border-blue-400' : 'border-gray-200 hover:bg-gray-100'}`}>
                                    <input type="radio" name={`q${currentQuestionIndex}`} value={key} checked={userAnswers[currentQuestionIndex] === key} onChange={() => handleAnswerSelect(currentQuestionIndex, key)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                    <span className="font-bold text-gray-500">{key}.</span>
                                    <span>{value}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        <button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50">Previous</button>
                        {currentQuestionIndex < activeTest.questions.length - 1 ? (
                            <button onClick={() => setCurrentQuestionIndex(p => Math.min(activeTest.questions.length - 1, p + 1))} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Next</button>
                        ) : (
                            <button onClick={handleSubmit} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">Submit Test</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    if (testState === 'finished' && activeTest) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Test Complete!</h1>
                    <p className="text-lg text-gray-600 mt-2">Here are your results for the {activeTest.name}.</p>
                    <div className="my-8">
                        <div className={`text-6xl font-bold ${results.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>{results.score}%</div>
                        <p className="text-gray-500">Overall Score</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-green-50 p-4 rounded-lg"><div className="text-2xl font-bold text-green-700">{results.correct}</div><p className="text-sm text-green-600">Correct</p></div>
                        <div className="bg-red-50 p-4 rounded-lg"><div className="text-2xl font-bold text-red-700">{results.incorrect}</div><p className="text-sm text-red-600">Incorrect</p></div>
                        <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold text-gray-700">{results.unanswered}</div><p className="text-sm text-gray-600">Unanswered</p></div>
                    </div>
                     <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <button onClick={() => handleStartTest(activeTest.name.split(': ')[1], activeTest.difficulty)} className="px-6 py-2 font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">Regenerate Test</button>
                        <button onClick={handleDownloadResults} className="flex items-center gap-2 px-6 py-2 font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">
                           <DownloadIcon /> Download PDF
                        </button>
                        <button onClick={handleReset} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">All Exams</button>
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
                    <div className="space-y-6">
                        {activeTest.questions.map((q, index) => {
                            const userAnswer = userAnswers[index];
                            const isCorrect = userAnswer === q.answer;
                            return (
                                <div key={index} className="border-b border-gray-200 pb-4">
                                    <p className="font-semibold text-gray-800">{`Q${index + 1}: ${q.question}`}</p>
                                    <p className="mt-2 text-sm flex items-center gap-2">
                                        <span className="font-bold text-green-600">Correct Answer:</span>
                                        <span>{q.answer}. {q.options[q.answer as keyof typeof q.options]}</span>
                                    </p>
                                    <div className="mt-2 text-sm flex items-center gap-2">
                                        <span className={`font-bold ${!userAnswer ? 'text-gray-600' : isCorrect ? 'text-green-600' : 'text-red-600'}`}>Your Answer:</span>
                                        {!userAnswer ? (
                                            <span className="text-gray-500 italic">Not Answered</span>
                                        ) : (
                                            <>
                                                <span>{userAnswer}. {q.options[userAnswer as keyof typeof q.options]}</span>
                                                {isCorrect ? <CheckCircleIcon /> : <XCircleIcon />}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};