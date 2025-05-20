import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import sequelize from './config/database';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// Database synchronization and server start
const startServer = async () => {
  try {
    // Force sync to recreate tables
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();