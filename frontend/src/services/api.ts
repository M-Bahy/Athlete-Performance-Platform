import axios from 'axios';
import { Athlete, Video, PerformanceMetric } from '../types';

const API_URL = 'http://localhost:5000/api';

// Athlete Services
export const getAthletes = () => axios.get<Athlete[]>(`${API_URL}/athletes`);
export const getAthlete = (id: number) => axios.get<Athlete>(`${API_URL}/athletes/${id}`);
export const createAthlete = (athlete: Omit<Athlete, 'id'>) => 
  axios.post<Athlete>(`${API_URL}/athletes`, athlete);
export const updateAthlete = (id: number, athlete: Partial<Athlete>) =>
  axios.put<Athlete>(`${API_URL}/athletes/${id}`, athlete);
export const deleteAthlete = (id: number) => 
  axios.delete(`${API_URL}/athletes/${id}`);

// Video Services
export const getVideos = () => axios.get<Video[]>(`${API_URL}/videos`);
export const getVideo = (id: number) => axios.get<Video>(`${API_URL}/videos/${id}`);
export const uploadVideo = (formData: FormData) => 
  axios.post<Video>(`${API_URL}/videos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const updateVideo = (id: number, video: Partial<Video>) =>
  axios.put<Video>(`${API_URL}/videos/${id}`, video);
export const deleteVideo = (id: number) => 
  axios.delete(`${API_URL}/videos/${id}`);

// Performance Metric Services
export const getMetricsByVideo = (videoId: number) => 
  axios.get<PerformanceMetric[]>(`${API_URL}/metrics/video/${videoId}`);
export const createMetric = (metric: Omit<PerformanceMetric, 'id'>) =>
  axios.post<PerformanceMetric>(`${API_URL}/metrics`, metric);
export const updateMetric = (id: number, metric: Partial<PerformanceMetric>) =>
  axios.put<PerformanceMetric>(`${API_URL}/metrics/${id}`, metric);
export const deleteMetric = (id: number) =>
  axios.delete(`${API_URL}/metrics/${id}`);
