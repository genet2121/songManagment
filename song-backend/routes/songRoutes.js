import express from 'express';
import upload from '../middleware/upload.js';
import {
  createSong,
  getSongs,
  updateSong,
  deleteSong,
  getStats,
  getSongById
} from '../controllers/songController.js';

const router = express.Router();

// router.post('/create', upload.single('img_imageUrlsecure_url'), createSong);
router.post(
  '/create',
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'audioUrl', maxCount: 1 }
  ]),
  createSong
);

router.get('/getAll', getSongs);
router.put('/update/:id',  upload.fields([
  { name: 'imageUrl', maxCount: 1 },
  { name: 'audioUrl', maxCount: 1 }
]), updateSong);
router.delete('/delete/:id', deleteSong);
router.get('/stats/all', getStats);
router.get('/getById/:id', getSongById); 
export default router;
