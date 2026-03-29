import Tesseract from 'tesseract.js';
import axios from 'axios';

/**
 * Parses receipt image using Tesseract.js (Local) or Google Vision (Cloud).
 * @param {Buffer} imageBuffer - The receipt image data.
 * @returns {Promise<Object>} Extracted fields.
 */
export const parseReceipt = async (imageBuffer) => {
  const visionApiKey = process.env.GOOGLE_VISION_API_KEY;

  if (visionApiKey) {
    return await parseWithGoogleVision(imageBuffer, visionApiKey);
  } else {
    return await parseWithTesseract(imageBuffer);
  }
};

const parseWithTesseract = async (imageBuffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
    
    // Simple regex extraction for demo purposes
    const amountMatch = text.match(/[\$£€]\s?(\d+\.?\d*)/);
    const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);

    return {
      amount: amountMatch ? parseFloat(amountMatch[1]) : null,
      currency: text.includes('$') ? 'USD' : text.includes('€') ? 'EUR' : 'INR',
      date: dateMatch ? new Date(dateMatch[1]) : new Date(),
      merchantName: text.split('\n')[0] || 'Unknown Merchant',
      description: `Parsed from receipt: ${text.substring(0, 50)}...`,
      rawText: text
    };
  } catch (error) {
    console.error('Tesseract Error:', error);
    throw new Error('OCR Parsing failed locally');
  }
};

const parseWithGoogleVision = async (imageBuffer, apiKey) => {
  try {
    const base64Image = imageBuffer.toString('base64');
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION' }]
        }]
      }
    );

    const fullText = response.data.responses[0]?.fullTextAnnotation?.text || '';
    
    // Heuristic extraction
    const amountMatch = fullText.match(/TOTAL\s?[:\-]?\s?[\$£€]?\s?(\d+\.?\d*)/i);
    
    return {
      amount: amountMatch ? parseFloat(amountMatch[1]) : null,
      merchantName: fullText.split('\n')[0],
      rawText: fullText,
      source: 'Google Vision'
    };
  } catch (error) {
    console.error('Google Vision Error:', error);
    return await parseWithTesseract(imageBuffer); // Fallback
  }
};

export default {
  parseReceipt
};
