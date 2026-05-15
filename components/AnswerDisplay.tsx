import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { FileText, BookOpen, Send, Share2 } from 'lucide-react';
import { shareContent, shareToWhatsApp } from '../lib/exportUtils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AnswerDisplayProps {
  answer: string;
  title?: string;
  onRefresh?: () => void;
  onGenerateMore?: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
  isGeneratingMore?: boolean;
  generateMoreTooltip?: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  answer, 
  title = "AI Generated Answer",
  onRefresh,
  onGenerateMore,
  onDownload,
  isLoading,
  isGeneratingMore,
  generateMoreTooltip = 'Get more details'
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(answer);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloadingPDF(true);
    try {
      const element = contentRef.current;
      
      // Create a temporary container for the PDF content
      const pdfWrapper = document.createElement('div');
      pdfWrapper.style.position = 'fixed';
      pdfWrapper.style.top = '0';
      pdfWrapper.style.left = '0';
      pdfWrapper.style.width = '1000px';
      pdfWrapper.style.zIndex = '-9999';
      pdfWrapper.style.opacity = '1'; // Keep opaque for html2canvas
      
      const clone = element.cloneNode(true) as HTMLElement;
      clone.classList.add('pdf-export-active', 'pdf-export-container');
      
      // Remove no-pdf elements
      clone.querySelectorAll('.no-pdf').forEach(el => el.remove());
      
      pdfWrapper.appendChild(clone);
      document.body.appendChild(pdfWrapper);
      
      // Wait for layout
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1000
      });
      
      document.body.removeChild(pdfWrapper);
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // First Page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      
      // Remaining Pages (with small 2mm overlap for readability)
      const overlap = 2; 
      while (heightLeft > 0) {
        position = (heightLeft - imgHeight) + overlap;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= (pageHeight - overlap);
      }
      
      pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check your browser permissions.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  if (!answer) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg flex items-start gap-4">
        <div className="flex-shrink-0">
          <LightbulbIcon />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-800">Ready to help!</h3>
          <p className="text-blue-700 mt-1">Your generated content will appear here once you make a request.</p>
        </div>
      </div>
    );
  }

  const actionButtonClasses = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100" ref={contentRef}>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4 border-b border-gray-100 pb-4">
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">{title}</h2>
          <p className="hidden pdf-only text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-2">Gov Exam AI Prep • Study Material</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap no-pdf">
          {onRefresh && (
            <button onClick={onRefresh} disabled={isLoading || isGeneratingMore} className={actionButtonClasses} title="Regenerate the answer">
              <RefreshIcon /> <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
          {onGenerateMore && (
            <button onClick={onGenerateMore} disabled={isLoading || isGeneratingMore} className={actionButtonClasses} title={generateMoreTooltip}>
              {isGeneratingMore ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : <PlusIcon />}
              <span className="hidden sm:inline">{isGeneratingMore ? 'Generating...' : 'Generate More'}</span>
            </button>
          )}
           {onDownload && (
            <button onClick={onDownload} disabled={isLoading || isGeneratingMore || !answer} className={actionButtonClasses} title="Download as Markdown file">
              <DownloadIcon /> <span className="hidden sm:inline">Download</span>
            </button>
          )}
          <button 
            onClick={handleDownloadPDF} 
            disabled={isLoading || isGeneratingMore || !answer || isDownloadingPDF} 
            className={actionButtonClasses} 
            title="Download as PDF"
          >
            {isDownloadingPDF ? (
              <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : <FileText className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDownloadingPDF ? 'Converting...' : 'PDF'}</span>
          </button>
          <button
            onClick={handleCopy}
            className={actionButtonClasses}
            aria-label="Copy answer to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                const text = `*${title}*\n\n${answer}`;
                shareToWhatsApp(text);
              }}
              className={`${actionButtonClasses} bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 border border-[#25D366]/20`}
              title="Share on WhatsApp"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button 
              onClick={() => shareContent(title, answer.substring(0, 300))}
              className={`${actionButtonClasses} bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200`}
              title="Share Content"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="markdown-body text-left">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
      </div>
      <div className="hidden pdf-only mt-12 pt-6 border-t border-gray-100 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
        Study hard, stay consistent. Success is yours.
      </div>
    </div>
  );
};