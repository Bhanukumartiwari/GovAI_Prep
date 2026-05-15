import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const shareToWhatsApp = (text: string) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

export const shareContent = async (title: string, text: string, url: string = window.location.href) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback to whatsapp if share fails or is cancelled
      shareToWhatsApp(`${title}\n\n${text}\n\nRead more at: ${url}`);
    }
  } else {
    shareToWhatsApp(`${title}\n\n${text}\n\nRead more at: ${url}`);
  }
};
