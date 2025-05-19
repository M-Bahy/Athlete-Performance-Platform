import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import { Video, Athlete } from '../../types';
import * as api from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  video?: Video;
  onSuccess: () => void;
}

export const VideoForm: React.FC<Props> = ({
  open,
  onClose,
  video,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    athleteId: '',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await api.getAthletes();
        setAthletes(response.data);
      } catch (error) {
        console.error('Error fetching athletes:', error);
      }
    };

    fetchAthletes();
  }, []);

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        athleteId: video.athleteId.toString(),
        notes: video.notes || '',
      });
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (video) {
        await api.updateVideo(video.id, {
          ...formData,
          athleteId: Number(formData.athleteId),
        });
      } else if (file) {
        const formDataToSend = new FormData();
        formDataToSend.append('video', file);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('athleteId', formData.athleteId);
        formDataToSend.append('notes', formData.notes);
        await api.uploadVideo(formDataToSend);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{video ? 'Edit Video' : 'Upload New Video'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              name="athleteId"
              label="Athlete"
              value={formData.athleteId}
              onChange={handleChange}
              required
              fullWidth
            >
              {athletes.map((athlete) => (
                <MenuItem key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="notes"
              label="Notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            {!video && (
              <Button variant="outlined" component="label">
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleFileChange}
                  required
                />
              </Button>
            )}
            {file && <Typography>{file.name}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {video ? 'Save Changes' : 'Upload'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
