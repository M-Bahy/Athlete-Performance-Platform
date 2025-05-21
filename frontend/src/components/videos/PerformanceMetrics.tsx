import React, { useState, useEffect, useRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Video, PerformanceMetric } from '../../types';
import * as api from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  video?: Video;
}

const metricTypes = [
  { value: 'sprint_time', label: 'Sprint Time (s)' },
  { value: 'jump_height', label: 'Jump Height (cm)' },
];

export const PerformanceMetrics: React.FC<Props> = ({
  open,
  onClose,
  video,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [formData, setFormData] = useState({
    metricType: 'sprint_time',
    value: '',
    timestamp: '',
    notes: '',
  });
  const [editingMetric, setEditingMetric] = useState<PerformanceMetric | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchMetrics = async () => {
    if (video) {
      try {
        const response = await api.getMetricsByVideo(video.id);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }
  };

  useEffect(() => {
    if (open && video) {
      fetchMetrics();
    }
    return () => {
      setFormData({
        metricType: 'sprint_time',
        value: '',
        timestamp: '',
        notes: '',
      });
      setEditingMetric(null);
    };
  }, [open, video]);

  useEffect(() => {
    if (editingMetric) {
      setFormData({
        metricType: editingMetric.metricType,
        value: editingMetric.value.toString(),
        timestamp: editingMetric.timestamp.toString(),
        notes: editingMetric.notes || '',
      });
    }
  }, [editingMetric]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !videoRef.current) return;

    const timestamp = Number(formData.timestamp);
    if (timestamp > videoRef.current.duration) {
      alert(`Timestamp cannot be greater than video duration (${Math.floor(videoRef.current.duration)} seconds)`);
      return;
    }

    try {
      if (editingMetric) {
        await api.updateMetric(editingMetric.id, {
          value: Number(formData.value),
          notes: formData.notes,
        });
      } else {
        await api.createMetric({
          videoId: video.id,
          metricType: formData.metricType,
          value: Number(formData.value),
          timestamp: timestamp,
          notes: formData.notes,
        });
      }
      fetchMetrics();
      setFormData({
        metricType: 'sprint_time',
        value: '',
        timestamp: '',
        notes: '',
      });
      setEditingMetric(null);
    } catch (error) {
      console.error('Error saving metric:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this metric?')) {
      try {
        await api.deleteMetric(id);
        fetchMetrics();
      } catch (error) {
        console.error('Error deleting metric:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentTimestamp = () => {
    if (videoRef.current) {
      setFormData({
        ...formData,
        timestamp: Math.floor(videoRef.current.currentTime).toString(),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Performance Metrics{video ? `: ${video.title}` : ''}</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2}>
          <Box flex={1}>
            {video && (
              <video
                ref={videoRef}
                controls
                src={`http://localhost:5000/api/videos/${video.id}/stream`}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            )}
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  select
                  name="metricType"
                  label="Metric Type"
                  value={formData.metricType}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={!!editingMetric}
                >
                  {metricTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="value"
                  label="Value"
                  type="number"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <Box display="flex" gap={1}>                <TextField
                  name="timestamp"
                  label="Timestamp (s)"
                  type="number"
                  value={formData.timestamp}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={!!editingMetric}
                  inputProps={{
                    min: 0,
                    max: videoRef.current?.duration || undefined,
                    step: 1
                  }}
                  helperText={videoRef.current?.duration ? `Max: ${Math.floor(videoRef.current.duration)}s` : undefined}
                />
                  {!editingMetric && (
                    <Button variant="contained" onClick={getCurrentTimestamp}>
                      Current Time
                    </Button>
                  )}
                </Box>
                <TextField
                  name="notes"
                  label="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                  {editingMetric ? 'Update Metric' : 'Add Metric'}
                </Button>
                {editingMetric && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingMetric(null);
                      setFormData({
                        metricType: 'sprint_time',
                        value: '',
                        timestamp: '',
                        notes: '',
                      });
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </form>
          </Box>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              Recorded Metrics
            </Typography>
            <List>
              {metrics.map((metric) => (
                <ListItem
                  key={metric.id}
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => setEditingMetric(metric)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(metric.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography>
                        {metricTypes.find((t) => t.value === metric.metricType)?.label}:{' '}
                        {metric.value}
                        {metric.metricType === 'sprint_time' ? 's' : 'cm'}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Timestamp: {metric.timestamp}s
                        </Typography>
                        {metric.notes && (
                          <Typography variant="body2">Notes: {metric.notes}</Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
