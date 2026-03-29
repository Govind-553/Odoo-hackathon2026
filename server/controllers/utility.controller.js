import { parseReceipt } from '../services/ocrService.js';
import axios from 'axios';
import NodeCache from 'node-cache';

const currencyCache = new NodeCache({ stdTTL: 86400 }); // 24 hours

// @desc    Parse receipt image for OCR
// @route   POST /api/ocr/parse
// @access  Employee
export const parseOCR = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image file');
    }

    // Process buffer; extract values
    const data = await parseReceipt(req.file.buffer);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get support currencies and countries
// @route   GET /api/currencies
// @access  Public
export const getCurrencies = async (req, res, next) => {
  try {
    let countries = currencyCache.get('countries');

    if (!countries) {
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
      countries = response.data.map(c => ({
        name: c.name.common,
        currencies: c.currencies ? Object.keys(c.currencies) : []
      }));
      currencyCache.set('countries', countries);
    }

    res.json({ success: true, data: countries });
  } catch (error) {
    next(error);
  }
};
