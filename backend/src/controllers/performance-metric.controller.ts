import { Request, Response } from 'express';
import { PerformanceMetric, Video } from '../models';

export const createMetric = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId, metricType, value, timestamp, notes } = req.body;
    
    // Verify video exists
    const video = await Video.findByPk(videoId);
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    const metric = await PerformanceMetric.create({
      videoId,
      metricType,
      value,
      timestamp,
      notes
    });

    res.status(201).json(metric);
  } catch (error) {
    res.status(500).json({ message: 'Error creating performance metric', error });
  }
};

export const getMetricsByVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoId = req.params.videoId;
    const metrics = await PerformanceMetric.findAll({
      where: { videoId },
      order: [['timestamp', 'ASC']]
    });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance metrics', error });
  }
};

export const updateMetric = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value, notes } = req.body;
    const metric = await PerformanceMetric.findByPk(req.params.id);
    
    if (!metric) {
      res.status(404).json({ message: 'Performance metric not found' });
      return;
    }

    await metric.update({ value, notes });
    res.json(metric);
  } catch (error) {
    res.status(500).json({ message: 'Error updating performance metric', error });
  }
};

export const deleteMetric = async (req: Request, res: Response): Promise<void> => {
  try {
    const metric = await PerformanceMetric.findByPk(req.params.id);
    
    if (!metric) {
      res.status(404).json({ message: 'Performance metric not found' });
      return;
    }

    await metric.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting performance metric', error });
  }
};
