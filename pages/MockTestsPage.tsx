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
        
        const title = `Result: ${activeTest.name}`;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let reportHtml = `
            <div style="text-align:center; margin-bottom: 40px;">
                <h1 style="font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 8px;">GovAI Performance Report</h1>
                <p style="color: #6B7280; font-weight: 600;">MISSION: ${activeTest.name.toUpperCase()}</p>
            </div>
            <div style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin-bottom: 32px; display: grid; grid-template-cols: repeat(4, 1fr); text-align: center;">
                <div><div style="font-size: 24px; font-weight: 800; color: #3B82F6;">${results.score}%</div><div style="font-size: 10px; font-weight: 800; color: #9CA3AF; text-transform: uppercase;">Final Score</div></div>
                <div><div style="font-size: 24px; font-weight: 800; color: #10B981;">${results.correct}</div><div style="font-size: 10px; font-weight: 800; color: #9CA3AF; text-transform: uppercase;">Correct</div></div>
                <div><div style="font-size: 24px; font-weight: 800; color: #EF4444;">${results.incorrect}</div><div style="font-size: 10px; font-weight: 800; color: #9CA3AF; text-transform: uppercase;">Incorrect</div></div>
                <div><div style="font-size: 24px; font-weight: 800; color: #6B7280;">${results.unanswered}</div><div style="font-size: 10px; font-weight: 800; color: #9CA3AF; text-transform: uppercase;">Unanswered</div></div>
            </div>
            <hr style="border: 0; border-top: 2px dashed #E5E7EB; margin-bottom: 32px;" />
            <h2 style="font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.1em;">Detailed Debrief</h2>
        `;

        activeTest.questions.forEach((q, index) => {
            const userAnswerKey = userAnswers[index];
            const userAnswerText = userAnswerKey ? `${userAnswerKey}. ${q.options[userAnswerKey as keyof typeof q.options]}` : 'NOT ANSWERED';
            const correctAnswerText = `${q.answer}. ${q.options[q.answer as keyof typeof q.options]}`;
            const isCorrect = userAnswerKey === q.answer;

            reportHtml += `
                <div style="margin-bottom: 40px; page-break-inside: avoid;">
                    <p style="font-weight: 800; font-size: 14px; margin-bottom: 8px; color: #111827;">Q${index + 1}. ${q.question}</p>
                    <div style="font-size: 13px; color: #4B5563; margin-left: 20px; margin-bottom: 12px;">
                        <div>A: ${q.options.A}</div>
                        <div>B: ${q.options.B}</div>
                        <div>C: ${q.options.C}</div>
                        <div>D: ${q.options.D}</div>
                    </div>
                    <div style="padding: 12px; border-radius: 8px; font-weight: 700; font-size: 12px; margin-bottom: 8px; ${!userAnswerKey ? 'background:#F3F4F6;' : isCorrect ? 'background:#ECFDF5; color:#065F46;' : 'background:#FEF2F2; color:#991B1B;'}">
                        RESULT: ${userAnswerText} ${isCorrect ? '✓' : '✗'}
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #065F46; margin-bottom: 8px;">OPTIMAL ANSWER: ${correctAnswerText}</div>
                    <div style="font-size: 12px; line-height: 1.6; color: #4B5563; background: #F3F4F6; padding: 12px; border-radius: 8px; border-left: 4px solid #3B82F6;">
                        <span style="font-weight: 800; display: block; margin-bottom: 4px; color: #1F2937;">EXPLANATION:</span>
                        ${q.explanation}
                    </div>
                </div>
            `;
        });
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; line-height: 1.5; max-width: 800px; margin: 0 auto; }
                    </style>
                </head>
                <body>${reportHtml}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
                <Loader />
                <h3 className="mt-8 text-2xl font-bold font-display text-gray-900">Preparing Simulator...</h3>
                <p className="text-gray-400 font-medium">Calibrating difficulty parameters and fetching questions.</p>
            </div>
        )
    }

    if (testState === 'selection') {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
                <div className="flex items-center justify-between mb-10">
                    <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                        <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                        <span className="mx-3 opacity-30">/</span>
                        <span className="text-gray-900">Mock Simulator</span>
                    </nav>
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
                    >
                        <BackIcon />
                        <span>Return to Command</span>
                    </button>
                </div>

                <header className="max-w-2xl mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
                        Test <span className="text-blue-600">Simulator.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        Precision-engineered adaptive testing environment to simulate real examination pressure.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map(exam => (
                        <div key={exam.id} className="relative group overflow-hidden bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                            <div className="p-8 md:p-10 flex flex-col h-full">
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <span className="w-4 h-0.5 bg-blue-600"></span>
                                    Simulation Profile
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{exam.name}</h2>
                                <p className="text-gray-500 font-medium leading-relaxed flex-grow">
                                    {exam.description}
                                </p>
                                <button 
                                    onClick={() => handleExamSelect(exam)} 
                                    className="mt-10 w-full py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl group-hover:bg-blue-600 transition-all active:scale-95 text-xs uppercase tracking-widest"
                                >
                                    Initiate Simulator
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (testState === 'subject_selection' && selectedExam) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
                <button
                    onClick={backToExamSelection}
                    className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 mb-10 transition-colors"
                >
                    <BackIcon /> Back to Exams
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-display mb-4">
                        {selectedExam.name} <span className="text-blue-600">Modules.</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-medium italic">
                        Configure simulation parameters for optimal performance tracking.
                    </p>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-lg p-8 md:p-12">
                    <div className="mb-10">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block">Simulation Intensity</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`py-4 rounded-2xl font-bold transition-all ${difficulty === d ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block">Select Operational Subject</label>
                        {subjectsByExam[selectedExam.id].map(subject => (
                            <button 
                                key={subject} 
                                onClick={() => handleStartTest(subject, difficulty)} 
                                className="w-full group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                            >
                                <div className="text-left">
                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{subject}</h3>
                                    <div className="flex gap-4 mt-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">10 OBJECTIVES</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">10 MINUTES</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
                    <div className="bg-gray-900 px-8 md:px-12 py-8 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Active Simulation</div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tight">{activeTest.name}</h1>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                            <div className="text-right">
                                <div className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Time Remaining</div>
                                <div className={`text-2xl font-black font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <TimerIcon />
                        </div>
                    </div>

                    <div className="w-full bg-gray-100 h-1.5">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-700 ease-out" 
                            style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="p-8 md:p-16">
                        <div className="mb-12">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6 block">Question {currentQuestionIndex + 1} of {activeTest.questions.length}</span>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-16">
                            {Object.entries(currentQuestion.options).map(([key, value]) => (
                                <button 
                                    key={key} 
                                    onClick={() => handleAnswerSelect(currentQuestionIndex, key)}
                                    className={`group flex items-center gap-6 p-6 md:p-8 rounded-[32px] border-2 transition-all text-left ${userAnswers[currentQuestionIndex] === key ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200' : 'bg-white border-gray-100 hover:border-blue-200'}`}
                                >
                                    <div className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-black transition-all ${userAnswers[currentQuestionIndex] === key ? 'bg-white text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                        {key}
                                    </div>
                                    <span className={`text-lg md:text-xl font-bold transition-all ${userAnswers[currentQuestionIndex] === key ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {value}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                            <button 
                                onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} 
                                disabled={currentQuestionIndex === 0} 
                                className="w-full sm:w-auto px-10 py-5 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] hover:text-gray-900 transition-colors disabled:opacity-0"
                            >
                                Previous Objective
                            </button>
                            
                            {currentQuestionIndex < activeTest.questions.length - 1 ? (
                                <button 
                                    onClick={() => setCurrentQuestionIndex(p => Math.min(activeTest.questions.length - 1, p + 1))} 
                                    className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-[0.2em] text-[10px]"
                                >
                                    Next Phase
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSubmit} 
                                    className="w-full sm:w-auto px-12 py-6 bg-gray-900 text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all active:scale-95 uppercase tracking-[0.2em] text-[10px]"
                                >
                                    Submit Final Results
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (testState === 'finished' && activeTest) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
                <header className="text-center mb-16">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-4">Post-Mission Debriefing</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display">Performance <span className="text-blue-600">Metrics.</span></h1>
                </header>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 md:p-16 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="flex-shrink-0 relative">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                                <circle 
                                    cx="96" 
                                    cy="96" 
                                    r="88" 
                                    stroke="currentColor" 
                                    strokeWidth="12" 
                                    fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - results.score / 100)}
                                    strokeLinecap="round"
                                    className={`${results.score >= 50 ? 'text-blue-600' : 'text-red-500'} transition-all duration-1000`} 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-black ${results.score >= 50 ? 'text-blue-600' : 'text-red-500'}`}>{results.score}%</span>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Accuracy</span>
                            </div>
                        </div>

                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                            <div className="bg-gray-50 p-6 rounded-[32px] text-center border border-gray-100 hover:border-blue-100 transition-colors group">
                                <div className="text-3xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{results.correct}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Validated</div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-[32px] text-center border border-gray-100 hover:border-red-100 transition-colors group">
                                <div className="text-3xl font-black text-gray-900 mb-1 group-hover:text-red-500 transition-colors">{results.incorrect}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deviation</div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-[32px] text-center border border-gray-100 transition-colors">
                                <div className="text-3xl font-black text-gray-900 mb-1">{results.unanswered}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Skipped</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-4">
                        <button onClick={() => handleStartTest(activeTest.name.split(': ')[1], activeTest.difficulty)} className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-widest">Regenerate Simulation</button>
                        <button onClick={handleDownloadResults} className="px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3">
                            <DownloadIcon /> Export Report
                        </button>
                        <button onClick={handleReset} className="px-10 py-5 bg-white text-gray-400 border border-gray-100 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95 text-xs uppercase tracking-widest">Mission Control</button>
                    </div>
                </div>

                <div className="space-y-12 mb-20">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight ml-4 flex items-center gap-4">
                        <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                        Module Deep-Dive
                    </h2>
                    {activeTest.questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.answer;
                        return (
                            <div key={index} className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-lg transition-all p-8 md:p-12">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-3/4">
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-4">Objective {index + 1}</div>
                                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-8 leading-snug">
                                            {q.question}
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 gap-3 mb-8">
                                            {Object.entries(q.options).map(([key, value]) => (
                                                <div 
                                                    key={key}
                                                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${q.answer === key ? 'bg-green-50 border-green-200' : userAnswer === key ? 'bg-red-50 border-red-200' : 'bg-gray-50/50 border-gray-50'}`}
                                                >
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${q.answer === key ? 'bg-green-600 text-white' : userAnswer === key ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>{key}</span>
                                                    <span className={`font-bold ${q.answer === key ? 'text-green-900' : userAnswer === key ? 'text-red-900' : 'text-gray-500'}`}>{value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-50 relative">
                                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Tactical Intelligence</div>
                                            <p className="text-gray-600 font-medium leading-relaxed italic pr-12">
                                                {q.explanation}
                                            </p>
                                            <div className="absolute top-8 right-8 text-blue-100">
                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16V16C10.9124 16 10.017 16.8954 10.017 18V21H4.01701V11C4.01701 10.4477 4.46473 10 5.01701 10H19.017C19.5693 10 20.017 10.4477 20.017 11V21H14.017Z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-1/4">
                                        <div className={`p-8 rounded-[32px] text-center flex flex-col items-center justify-center h-full transition-all ${isCorrect ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                            <div className="mb-4">
                                                {isCorrect ? (
                                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                ) : (
                                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status</div>
                                            <div className="text-xl font-black uppercase tracking-tight">{isCorrect ? 'VALID' : 'FAILED'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
};
