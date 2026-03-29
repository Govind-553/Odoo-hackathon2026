import express from 'express';
import multer from 'multer';
import { parseOCR, getCurrencies } from '../controllers/utility.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Memory storage for OCR buffer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Public helpers
router.get('/currencies', getCurrencies);

// Professional Protected OCR parse
router.post('/parse-ocr', protect, upload.single('receipt'), parseOCR);

export default router;
