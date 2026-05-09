import * as pdfjsLib from 'pdfjs-dist';

// Use a more robust way to define the worker path in Vite
const pdfWorkerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ 
            data: arrayBuffer,
            disableFontFace: true, // Sometimes helps with extraction issues
            verbosity: 0
        });
        
        const pdf = await loadingTask.promise;
        console.log(`PDF Loaded: ${pdf.numPages} pages.`);
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            try {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Better text reconstruction
                const pageText = textContent.items
                    .map((item: any) => item.str || '')
                    .join(textContent.items.length > 5 ? ' ' : ''); // Guessing if we need spaces between small chunks
                
                fullText += pageText + '\n';
            } catch (pageErr) {
                console.error(`Error on page ${i}:`, pageErr);
            }
        }
        
        const result = fullText.trim();
        console.log(`Extraction complete. Length: ${result.length}`);
        
        if (result.length === 0 && pdf.numPages > 0) {
            console.warn("Possible scanned PDF detected - no text found in structural elements.");
        }
        
        return result;
    } catch (error) {
        console.error('Core PDF Extraction Error:', error);
        throw error;
    }
};

export const pdfToImages = async (file: File, maxPages: number = 3): Promise<{ data: string; mimeType: string }[]> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ 
            data: arrayBuffer,
            disableFontFace: true,
            verbosity: 0
        });
        const pdf = await loadingTask.promise;
        const images: { data: string; mimeType: string }[] = [];
        
        const numPages = Math.min(pdf.numPages, maxPages);
        
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) continue;
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({ 
                canvasContext: context, 
                viewport: viewport
            }).promise;
            
            const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
            images.push({ data: base64, mimeType: 'image/jpeg' });
        }
        
        return images;
    } catch (error) {
        console.error('Error converting PDF to images:', error);
        throw error;
    }
};
