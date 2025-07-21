import multer from 'multer';
import path from 'path';
import asyncHandler from 'express-async-handler';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png) are allowed!'));
  },
});

// Wrapper to catch multer errors
const uploadMiddleware = (fieldName) => asyncHandler(async (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      const error = new Error(err.message);
      error.status = 400;
      return next(error);
    }
    next();
  });
});

export default uploadMiddleware;