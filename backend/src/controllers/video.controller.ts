import { Request, Response } from 'express';
import { Video, Athlete } from '../models';
import { getVideoDurationInSeconds } from 'get-video-duration';
import path from 'path';
import fs from 'fs';

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'No video file uploaded' });
      return;
    }

    const { title, athleteId, notes } = req.body;
    
    const athlete = await Athlete.findByPk(athleteId);
    if (!athlete) {
      fs.unlinkSync(file.path);
      res.status(404).json({ message: 'Athlete not found' });
      return;
    }

    // Get video duration
    const duration = await getVideoDurationInSeconds(file.path);

    const video = await Video.create({
      title,
      filePath: file.path,
      athleteId,
      notes: notes || '',
      duration: Math.round(duration),
      fileSize: file.size,
      uploadDate: new Date(),
      mimeType: file.mimetype
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading video', error });
  }
};

export const getVideos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const videos = await Video.findAll({
      include: [Athlete],
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error });
  }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [Athlete],
    });
    
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching video', error });
  }
};

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, notes } = req.body;
    const video = await Video.findByPk(req.params.id);
    
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    await video.update({ title, notes });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error updating video', error });
  }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findByPk(req.params.id);
    
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    if (fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }

    await video.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error });
  }
};

export const streamVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findByPk(req.params.id);
    
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    if (!fs.existsSync(video.filePath)) {
      res.status(404).json({ message: 'Video file not found' });
      return;
    }

    const stat = fs.statSync(video.filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(video.filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(video.filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error streaming video', error });
  }
};