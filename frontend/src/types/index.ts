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
  notes?: string;
  athlete?: Athlete;
  createdAt?: string;
  updatedAt?: string;
}
