import axios from 'axios';
import { Athlete, Video, PerformanceMetric } from '../types';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include auth token (for future use)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Athlete Services
export const getAthletes = () => api.get<Athlete[]>(`/athletes`);
export const getAthlete = (id: number) => api.get<Athlete>(`/athletes/${id}`);
export const createAthlete = (athlete: Omit<Athlete, 'id'>) => 
  api.post<Athlete>(`/athletes`, athlete);
export const updateAthlete = (id: number, athlete: Partial<Athlete>) =>
  api.put<Athlete>(`/athletes/${id}`, athlete);
export const deleteAthlete = (id: number) => 
  api.delete(`/athletes/${id}`);

// Video Services
export const getVideos = () => api.get<Video[]>(`/videos`);
export const getVideo = (id: number) => api.get<Video>(`/videos/${id}`);
export const uploadVideo = (formData: FormData) => 
  api.post<Video>(`/videos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const updateVideo = (id: number, video: Partial<Video>) =>
  api.put<Video>(`/videos/${id}`, video);
export const deleteVideo = (id: number) => 
  api.delete(`/videos/${id}`);

// Performance Metric Services
export const getMetricsByVideo = (videoId: number) => 
  api.get<PerformanceMetric[]>(`/metrics/video/${videoId}`);
export const createMetric = (metric: Omit<PerformanceMetric, 'id'>) =>
  api.post<PerformanceMetric>(`/metrics`, metric);
export const updateMetric = (id: number, metric: Partial<PerformanceMetric>) =>
  api.put<PerformanceMetric>(`/metrics/${id}`, metric);
export const deleteMetric = (id: number) =>
  api.delete(`/metrics/${id}`);

// Auth Service (for future backend implementation)
export const login = (username: string, password: string) => 
  api.post('/auth/login', { username, password });
export const logout = () => 
  api.post('/auth/logout');
