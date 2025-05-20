import cron from 'node-cron';
import { updateVideoAnalysisStatus } from '../controllers/video.controller';

export const processStatusCron = () => {

    cron.schedule("*/10 * * * * *", () => {
      updateVideoAnalysisStatus();
    });

};