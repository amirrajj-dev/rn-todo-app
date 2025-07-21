import multer from 'multer';
import path from 'path';

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
    }
});

export default upload;