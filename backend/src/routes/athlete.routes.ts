import { Router } from 'express';
import {
  createAthlete,
  getAthletes,
  getAthleteById,
  updateAthlete,
  deleteAthlete,
} from '../controllers/athlete.controller';

const router = Router();

router.post('/', createAthlete);
router.get('/', getAthletes);
router.get('/:id', getAthleteById);
router.put('/:id', updateAthlete);
router.delete('/:id', deleteAthlete);

export default router;