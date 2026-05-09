import React, { useState, useRef } from 'react';
import { Page } from '../App';
import { BackIcon } from '../components/icons/BackIcon';
import { Loader } from '../components/Loader';
import { analyzeDocument, generateQuestionsFromText, analyzeDocumentMultimodal, generateQuestionsFromMultimodal, QuizResponse } from '../services/geminiService';
import { extractTextFromPdf, pdfToImages } from '../lib/pdfHelper';
import Markdown from 'react-markdown';
import { QuizDisplay } from '../components/QuizDisplay';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import { CameraIcon } from '../components/icons/CameraIcon';

interface DocumentAnalyzerPageProps {
    onNavigate: (page: Page) => void;
}

export const DocumentAnalyzerPage: React.FC<DocumentAnalyzerPageProps> = ({ onNavigate }) => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [imageParts, setImageParts] = useState<{ inlineData: { data: string; mimeType: string } }[]>([]);
    const [isHandwrittenMode, setIsHandwrittenMode] = useState(false);
    const [analysis, setAnalysis] = useState<string>('');
    const [quiz, setQuiz] = useState<QuizResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab ] = useState<'summary' | 'quiz'>('summary');
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processHandwritten = async (selectedFile: File) => {
        setIsLoading(true);
        try {
            let parts: { inlineData: { data: string; mimeType: string } }[] = [];
            if (selectedFile.type.startsWith('image/')) {
                const base64 = await fileToBase64(selectedFile);
                parts = [{ inlineData: { data: base64, mimeType: selectedFile.type } }];
            } else if (selectedFile.type === 'application/pdf') {
                const images = await pdfToImages(selectedFile);
                parts = images.map(img => ({ inlineData: img }));
            }
            
            if (parts.length === 0) throw new Error('Could not process document as images.');
            
            setImageParts(parts);
            const summary = await analyzeDocumentMultimodal(parts);
            setAnalysis(summary);
            setIsHandwrittenMode(true);
        } catch (err: any) {
            setError(err.message || 'Error processing handwritten note.');
        } finally {
            setIsLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setAnalysis('');
            setQuiz(null);
            setExtractedText('');
            setImageParts([]);
            setIsHandwrittenMode(false);
            
            try {
                setIsLoading(true);
                
                if (selectedFile.type.startsWith('image/')) {
                    await processHandwritten(selectedFile);
                    return;
                }

                let text = '';
                if (selectedFile.type === 'application/pdf') {
                    text = await extractTextFromPdf(selectedFile);
                } else if (selectedFile.type === 'text/plain') {
                    text = await selectedFile.text();
                } else {
                    throw new Error('Unsupported file type. Please upload a PDF, Image or .txt file.');
                }
                
                if (text.trim().length === 0) {
                    if (selectedFile.type === 'application/pdf') {
                        setIsLoading(false);
                        setError('No selectable text found in PDF. This might be a scanned document. Please click "Process as Scanned/Handwritten" below.');
                    } else {
                        throw new Error('File is empty.');
                    }
                } else {
                    setExtractedText(text);
                    const summary = await analyzeDocument(text);
                    setAnalysis(summary);
                }
                setIsLoading(false);
            } catch (err: any) {
                console.error('File processing error:', err);
                setError(err.message || 'Error processing file.');
                setIsLoading(false);
            }
        }
    };

    const handleGenerateQuestions = async () => {
        if (!extractedText && imageParts.length === 0) return;
        setIsLoading(true);
        setError(null);
        try {
            let generatedQuiz;
            if (isHandwrittenMode) {
                generatedQuiz = await generateQuestionsFromMultimodal(imageParts);
            } else {
                generatedQuiz = await generateQuestionsFromText(extractedText);
            }
            setQuiz(generatedQuiz);
            setActiveTab('quiz');
        } catch (err: any) {
            setError(err.message || 'Error generating questions.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'summary') {
                const summary = isHandwrittenMode 
                    ? await analyzeDocumentMultimodal(imageParts)
                    : await analyzeDocument(extractedText);
                setAnalysis(summary);
            } else {
                await handleGenerateQuestions();
            }
        } catch (err: any) {
            setError(err.message || 'Error regenerating content.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        const title = activeTab === 'summary' ? 'Document Summary' : 'Questions from Document';
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let html = `
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; max-width: 800px; margin: 0 auto; }
                    h1 { color: #111827; text-align: center; border-bottom: 4px solid #3b82f6; padding-bottom: 20px; font-weight: 800; font-size: 2.5rem; }
                    .section { margin-bottom: 30px; }
                    .question { margin-bottom: 24px; padding: 24px; border: 1px solid #f3f4f6; border-radius: 16px; background: #f9fafb; page-break-inside: avoid; }
                    .option { margin-left: 20px; color: #4b5563; }
                    .answer { font-weight: 700; color: #2563eb; margin-top: 12px; }
                    .explanation { font-style: italic; color: #6b7280; margin-top: 5px; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
        `;

        if (activeTab === 'summary') {
            html += `<div class="section">${analysis.replace(/\n/g, '<br/>')}</div>`;
        } else if (quiz) {
            quiz.quiz.forEach((q, i) => {
                html += `
                    <div class="question">
                        <p><strong>Q${i + 1}: ${q.question}</strong></p>
                        <div class="option">A: ${q.options.A}</div>
                        <div class="option">B: ${q.options.B}</div>
                        <div class="option">C: ${q.options.C}</div>
                        <div class="option">D: ${q.options.D}</div>
                        <p class="answer">Correct Answer: ${q.answer}</p>
                        <p class="explanation">Explanation: ${q.explanation}</p>
                    </div>
                `;
            });
        }

        html += `</body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
            <div className="flex items-center justify-between mb-10">
                <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                    <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                    <span className="mx-3 opacity-30">/</span>
                    <button onClick={() => onNavigate('tools')} className="hover:text-blue-600 transition-colors">Tools</button>
                    <span className="mx-3 opacity-30">/</span>
                    <span className="text-gray-900">Document Analyzer</span>
                </nav>
                <button 
                    onClick={() => onNavigate('tools')}
                    className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
                >
                    <BackIcon />
                    <span>Return to Arsenal</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-2">
                    <div className="sticky top-28">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
                            Smart <span className="text-blue-600 italic">Vision.</span>
                        </h1>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
                            Upload your PDFs, class notes, or handwritten snaps. Our AI extracts core concepts and builds practice material instantly.
                        </p>

                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                           
                           <div className="relative z-10">
                                <div 
                                    className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 bg-gray-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 cursor-pointer text-center group/uploader"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange}
                                        accept=".pdf,.txt,image/*"
                                    />
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover/uploader:bg-blue-600 group-hover/uploader:text-white transition-colors duration-300">
                                        <FileTextIcon />
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 mb-1">
                                        {file ? file.name : "Select Document"}
                                    </p>
                                    <p className="text-sm text-gray-400 font-medium">PDF, Image, or Text (Max 20MB)</p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm"><FileTextIcon /></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supports PDFs</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm"><CameraIcon /></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Handwriting</span>
                                    </div>
                                </div>
                           </div>
                        </div>

                        {error && (
                            <div className="mt-8 p-6 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-2xl font-bold animate-pulse">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="bg-white p-20 rounded-[40px] shadow-xl border border-gray-50 flex flex-col items-center justify-center text-center">
                            <Loader />
                            <h3 className="mt-8 text-2xl font-bold text-gray-900 font-display">Analyzing Document...</h3>
                            <p className="text-gray-500 mt-2 font-medium">Running Vision OCR and semantic extraction.</p>
                        </div>
                    ) : (analysis || quiz) ? (
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden min-h-[600px]">
                            <div className="flex bg-gray-50 p-2 gap-2">
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={`flex-1 py-4 rounded-[32px] text-center font-bold tracking-wide uppercase text-xs transition-all ${activeTab === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    AI Summary
                                </button>
                                <button
                                    onClick={() => {
                                        if (!quiz) handleGenerateQuestions();
                                        else setActiveTab('quiz');
                                    }}
                                    className={`flex-1 py-4 rounded-[32px] text-center font-bold tracking-wide uppercase text-xs transition-all ${activeTab === 'quiz' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Practice Quiz
                                </button>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <h2 className="text-3xl font-bold text-gray-900 font-display">
                                        {activeTab === 'summary' ? 'Concept Extraction' : 'Generated Assessment'}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button onClick={handleRegenerate} className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl transition-colors"><RefreshIcon /></button>
                                        <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all text-sm leading-none"><DownloadIcon /> Export PDF</button>
                                    </div>
                                </div>

                                <div className="relative">
                                    {activeTab === 'summary' && analysis && (
                                        <div className="prose prose-blue max-w-none markdown-body">
                                            <Markdown>{analysis}</Markdown>
                                        </div>
                                    )}

                                    {activeTab === 'quiz' && quiz && (
                                        <QuizDisplay 
                                            quizData={quiz} 
                                            onRegenerate={handleRegenerate} 
                                            onDownload={handleDownloadPdf}
                                            isRegenerating={isLoading}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/50 border-2 border-dashed border-gray-100 rounded-[48px] p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                <FileTextIcon />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-300 font-display uppercase tracking-widest">Awaiting Document</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
