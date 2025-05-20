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
}
