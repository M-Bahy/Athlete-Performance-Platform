import { Router } from 'express';
import athleteRoutes from './athlete.routes';
import videoRoutes from './video.routes';

const router = Router();

router.use('/athletes', athleteRoutes);
router.use('/videos', videoRoutes);

export default router;