import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      try {

  
        const isImage = file.mimetype.startsWith('image/');
        const isAudio = file.mimetype.startsWith('audio/');
  
        if (!isImage && !isAudio) {
          throw new Error('Unsupported file type');
        }
  
        return {
          resource_type: isAudio ? 'video' : 'image', 
          folder: isAudio ? 'audio/upload' : 'image/upload', 
          allowed_formats: isAudio
            ? ['mp3', 'wav', 'ogg', 'aac', 'mp4'] 
            : ['jpg', 'jpeg', 'png'], 
          ...(isImage && {
            transformation: [{ width: 500, height: 500, crop: 'limit' }], 
          }),
        };
      } catch (err) {
        console.error('Error in Cloudinary params:', err);
        throw err;
      }
    },
  });

const upload = multer({ storage });

export default upload;