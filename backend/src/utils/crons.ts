import cron from 'node-cron';

export const processStatusCron = () => {

    cron.schedule("*/10 * * * * *", () => {
    console.log("running a task every 10 second");
  });

};