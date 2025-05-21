import { Router } from 'express';
import {
  createMetric,
  getMetricsByVideo,
  updateMetric,
  deleteMetric,
} from '../controllers/performance-metric.controller';

const router = Router();

router.post('/', createMetric);
router.get('/video/:videoId', getMetricsByVideo);
router.put('/:id', updateMetric);
router.delete('/:id', deleteMetric);

export default router;
