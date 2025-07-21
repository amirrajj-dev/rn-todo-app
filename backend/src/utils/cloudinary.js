import {v2 as cloudinary} from 'cloudinary'
import { config } from 'dotenv';
import { ENV } from './env.js';

config();

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET
})

export default cloudinary;