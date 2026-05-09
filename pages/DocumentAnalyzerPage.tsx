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
                
                // If it's an image, always use multimodal
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
                        // For empty PDF text, suggest Vision OCR
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
        const content = activeTab === 'summary' ? analysis : ''; // Quiz serializing below
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let html = `
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                    h1 { color: #2b6cb0; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
                    .section { margin-bottom: 30px; }
                    .question { margin-bottom: 20px; padding: 15px; border: 1px solid #edf2f7; border-radius: 8px; }
                    .option { margin-left: 20px; }
                    .answer { font-weight: bold; color: #2c5282; margin-top: 10px; }
                    .explanation { font-style: italic; color: #4a5568; margin-top: 5px; }
                    .facts { background: #fffaf0; padding: 10px; border-left: 4px solid #ed8936; margin-top: 10px; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
        `;

        if (activeTab === 'summary') {
            html += `<div class="section"><div class="markdown-body">${analysis}</div></div>`;
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
                        ${q.relatedFacts && q.relatedFacts.length > 0 ? `
                            <div class="facts">
                                <strong>Related Facts:</strong>
                                <ul>${q.relatedFacts.map(f => `<li>${f}</li>`).join('')}</ul>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }

        html += `</body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => onNavigate('tools')}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
            >
                <BackIcon />
                Back to Tools
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">Document Analyzer & Question Generator</h1>
                        <p className="text-gray-500 mt-2">Upload your PDF, images, or study notes to get a smart AI analysis (Supports Hindi & English Handwriting).</p>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept=".pdf,.txt,image/*"
                        />
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-700">
                            {file ? file.name : "Upload PDF, Image (JPG/PNG), or TXT"}
                        </p>
                        <div className="flex gap-4 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500"><FileTextIcon /> Digital PDF/Text</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500"><CameraIcon /> Handwritten/Scanned</span>
                        </div>
                    </div>

                    {file && file.type === 'application/pdf' && !isHandwrittenMode && (
                        <div className="mt-4 flex justify-center">
                            <button 
                                onClick={() => processHandwritten(file)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                            >
                                Process as Handwritten/Scanned (using Vision AI)
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-md">
                            <p className="font-medium">Notice</p>
                            <p className="text-sm">{error}</p>
                            {file && file.type === 'application/pdf' && !isHandwrittenMode && (
                                <button 
                                    onClick={() => processHandwritten(file)}
                                    className="mt-2 text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                >
                                    Try Vision OCR Mode
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {isLoading && <Loader />}

                {(analysis || quiz) && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`flex-1 py-4 text-center font-bold tracking-wide uppercase text-sm ${activeTab === 'summary' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                AI Summary
                            </button>
                            <button
                                onClick={() => {
                                    if (!quiz) handleGenerateQuestions();
                                    else setActiveTab('quiz');
                                }}
                                className={`flex-1 py-4 text-center font-bold tracking-wide uppercase text-sm ${activeTab === 'quiz' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Practice Quiz
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {activeTab === 'summary' ? 'AI Summary' : ''}
                                </h2>
                                <div className="flex justify-end gap-3">
                                    {activeTab === 'summary' && (
                                        <>
                                            <button
                                                onClick={handleRegenerate}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <RefreshIcon /> Regenerate
                                            </button>
                                            <button
                                                onClick={handleDownloadPdf}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <DownloadIcon /> PDF Summary
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

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
                )}
            </div>
        </div>
    );
};
