import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  streamVideo,
} from '../controllers/video.controller';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.post('/', upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.get('/:id/stream', streamVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;