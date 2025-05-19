import { Request, Response } from 'express';
import { Athlete } from '../models';

export const createAthlete = async (req: Request, res: Response) => {
  try {
    const { name, sport, team } = req.body;
    const athlete = await Athlete.create({ name, sport, team });
    res.status(201).json(athlete);
  } catch (error) {
    res.status(500).json({ message: 'Error creating athlete', error });
  }
};

export const getAthletes = async (_req: Request, res: Response) => {
  try {
    const athletes = await Athlete.findAll();
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching athletes', error });
  }
};

export const getAthleteById = async (req: Request, res: Response) => {
  try {
    const athlete = await Athlete.findByPk(req.params.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching athlete', error });
  }
};

export const updateAthlete = async (req: Request, res: Response) => {
  try {
    const { name, sport, team } = req.body;
    const athlete = await Athlete.findByPk(req.params.id);
    
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    await athlete.update({ name, sport, team });
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ message: 'Error updating athlete', error });
  }
};

export const deleteAthlete = async (req: Request, res: Response) => {
  try {
    const athlete = await Athlete.findByPk(req.params.id);
    
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    await athlete.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting athlete', error });
  }
};