import { Router } from 'express';
import athleteRoutes from './athlete.routes';
import videoRoutes from './video.routes';
import performanceMetricRoutes from './performance-metric.routes';

const router = Router();

router.use('/athletes', athleteRoutes);
router.use('/videos', videoRoutes);
router.use('/metrics', performanceMetricRoutes);

export default router;