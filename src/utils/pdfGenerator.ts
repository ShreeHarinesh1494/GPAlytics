import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AnalysisResult, DetailedAnalysisResult } from '../types';

// Generate PDF from analysis result
export const generateAnalysisPdf = async (
  elementId: string, 
  analysisResult: AnalysisResult | DetailedAnalysisResult | null,
  isDetailed: boolean = false
): Promise<void> => {
  if (!analysisResult) return;
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return;
    }
    
    const canvas = await html2canvas(element, {
      scale: 50,
      logging: false,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    const fileName = isDetailed 
      ? `GPAlytics_Detailed_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`
      : `GPAlytics_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
    
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
};