export interface Athlete {
  id: number;
  name: string;
  sport: string;
  age: number;
}

export interface Video {
  id: number;
  title: string;
  filePath: string;
  athleteId: number;
  athlete: Athlete;  // Make sure this is not optional
  notes?: string;
  duration?: number;
  fileSize?: number;
  uploadDate: string;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
  analysisStatus?: string; // Added for analysis status
  performanceMetrics?: PerformanceMetric[]; // Added for performance metrics
}

export interface PerformanceMetric {
  id: number;
  videoId: number;
  metricType: string;  // e.g. 'sprint_time', 'jump_height'
  value: number;
  timestamp: number;  // timestamp in seconds within the video
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
