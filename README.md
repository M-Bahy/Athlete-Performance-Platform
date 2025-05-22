# Mini-Platform for Athlete Performance Insights

A comprehensive web-based platform that allows coaches to upload performance videos, tag athletes, and review key performance metrics. This application simulates a lightweight analytics platform for sports teams and individual athletes.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Database Schema](#database-schema)
- [REST API Endpoints](#rest-api-endpoints)
- [Setup Instructions](#setup-instructions)
- [API Usage Examples](#api-usage-examples)
- [Project Structure](#project-structure)

## Tech Stack

### Backend
- **Node.js** with **Express** (v5.1.0) - Fast, unopinionated web framework for Node.js
- **TypeScript** (v5.8.3) - For type-safe code
- **Sequelize ORM** (v6.37.7) - For database operations and modeling
- **PostgreSQL** (v8.16.0) - Relational database for data storage
- **Multer** (v2.0.0) - For handling file uploads (video files)
- **get-video-duration** (v4.1.0) - For analyzing video metadata
- **node-cron** (v4.0.5) - For scheduling tasks
- **Docker** - For containerization and deployment

### Frontend
- **React** (v19.1.0) - JavaScript library for building user interfaces
- **TypeScript** (v4.9.5) - For type-safe code
- **Material UI** (v7.1.0) - React component library
- **React Router** (v7.6.0) - For navigation and routing
- **Axios** (v1.9.0) - For HTTP requests
- **date-fns** (v4.1.0) - For date manipulation

## Features

- User authentication (coaches) 
- Athlete management (adding, editing, viewing athletes)
- Video upload and management
- Performance metrics tracking and analysis
- Video playback with annotation support
- Dashboard for coaches to review athlete performance
- RESTful API for all operations

## Database Schema

The application uses PostgreSQL with Sequelize ORM and consists of the following models:

### Athlete
```
id: Integer (Primary Key, Auto-increment)
name: String
sport: String
age: Integer
```

### Video
```
id: Integer (Primary Key, Auto-increment)
title: String
filePath: String
athleteId: Integer (Foreign Key -> Athlete.id)
notes: String (Optional)
duration: Float (in seconds)
fileSize: Integer (in bytes)
uploadDate: Date
mimeType: String
analysisStatus: String
createdAt: Date
updatedAt: Date
```

### Performance Metric
```
id: Integer (Primary Key, Auto-increment)
videoId: Integer (Foreign Key -> Video.id)
metricType: String (e.g., 'sprint_time', 'jump_height')
value: Float
timestamp: Integer (timestamp in seconds within the video)
notes: String (Optional)
createdAt: Date
updatedAt: Date
```

## REST API Endpoints

### Athletes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/athletes | Get all athletes |
| GET    | /api/athletes/:id | Get a specific athlete by ID |
| POST   | /api/athletes | Create a new athlete |
| PUT    | /api/athletes/:id | Update an athlete |
| DELETE | /api/athletes/:id | Delete an athlete |

### Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/videos | Get all videos |
| GET    | /api/videos/:id | Get a specific video by ID |
| GET    | /api/videos/:id/stream | Stream a video |
| POST   | /api/videos | Upload a new video |
| PUT    | /api/videos/:id | Update video details |
| DELETE | /api/videos/:id | Delete a video |

### Performance Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/metrics/video/:videoId | Get metrics for a specific video |
| POST   | /api/metrics | Create a new performance metric |
| PUT    | /api/metrics/:id | Update a performance metric |
| DELETE | /api/metrics/:id | Delete a performance metric |

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js (version 16+)
- npm or yarn
- Git

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/M-Bahy/Mini-Platform-for-Athlete-Performance-Insights.git
cd Mini-Platform-for-Athlete-Performance-Insights
```

2. Start the application using Docker Compose:
```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL database container
- Build and start the backend server (available at http://localhost:5000)
- Build and start the frontend React application (available at http://localhost:3000)

3. The application should now be running:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Manual Setup (Development)

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following configuration:
```
DB_NAME=athlete_platform
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_HOST=localhost
DB_PORT=5432
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following configuration:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

#### Database Setup

If you're not using Docker, you'll need to set up PostgreSQL locally:

1. Install PostgreSQL on your machine
2. Create a database named `athlete_platform`
3. Configure your database connection in the backend `.env` file

## API Usage Examples

### Athletes API

#### Create an Athlete
```bash
curl -X POST http://localhost:5000/api/athletes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "sport": "Swimming",
    "age": 22
  }'
```

#### Get All Athletes
```bash
curl http://localhost:5000/api/athletes
```

### Videos API

#### Upload a Video
```bash
curl -X POST http://localhost:5000/api/videos \
  -F "title=Freestyle Training" \
  -F "athleteId=1" \
  -F "notes=Technique analysis" \
  -F "video=@/path/to/video.mp4"
```

#### Get All Videos
```bash
curl http://localhost:5000/api/videos
```

### Performance Metrics API

#### Create a Performance Metric
```bash
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": 1,
    "metricType": "sprint_time",
    "value": 10.5,
    "timestamp": 45,
    "notes": "Great improvement"
  }'
```

#### Get Metrics for a Video
```bash
curl http://localhost:5000/api/metrics/video/1
```

## Project Structure

```
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── config/          # Database and server configuration
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   ├── uploads/             # Video uploads storage
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main application component
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yaml      # Docker Compose configuration
└── README.md                # Documentation
```
