import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Athlete, Video, PerformanceMetric } from '../../types';
import * as api from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  athlete: Athlete;
}

interface VideoWithMetrics extends Video {
  performanceMetrics: PerformanceMetric[];
}

const metricTypes = [
  { value: 'sprint_time', label: 'Sprint Time', unit: 's' },
  { value: 'jump_height', label: 'Jump Height', unit: 'cm' },
];

export const AthleteProfile: React.FC<Props> = ({ open, onClose, athlete }) => {
  const [videos, setVideos] = useState<VideoWithMetrics[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const fetchAthleteVideos = async () => {
    try {
      // Fetch all videos for this athlete
      const videosResponse = await api.getVideos();
      const athleteVideos = videosResponse.data.filter(v => v.athleteId === athlete.id);

      // Fetch metrics for each video
      const videosWithMetrics = await Promise.all(
        athleteVideos.map(async (video) => {
          const metricsResponse = await api.getMetricsByVideo(video.id);
          return {
            ...video,
            performanceMetrics: metricsResponse.data,
          };
        })
      );

      setVideos(videosWithMetrics);
    } catch (error) {
      console.error('Error fetching athlete videos and metrics:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAthleteVideos();
    }
  }, [open, athlete.id]);

  const getMetricStats = (metricType: string) => {
    const allMetrics = videos.flatMap(v => 
      v.performanceMetrics.filter(m => m.metricType === metricType)
    );
    
    if (allMetrics.length === 0) return null;

    const values = allMetrics.map(m => m.value);
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      best: metricType === 'sprint_time' ? Math.min(...values) : Math.max(...values),
      total: values.length
    };
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {athlete.name}'s Performance Profile
      </DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Athlete Details</Typography>
            <Typography><strong>Sport:</strong> {athlete.sport}</Typography>
            <Typography><strong>Age:</strong> {athlete.age}</Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>Performance Stats</Typography>
        <Box display="flex" gap={2} mb={3}>
          {metricTypes.map((type) => {
            const stats = getMetricStats(type.value);
            if (!stats) return null;
            
            return (
              <Card key={type.value} sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6">{type.label}</Typography>
                  <Typography>
                    Best: {stats.best}{type.unit}
                  </Typography>
                  <Typography>
                    Average: {stats.avg.toFixed(2)}{type.unit}
                  </Typography>
                  <Typography>
                    Total Records: {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        <Typography variant="h6" gutterBottom>Performance History</Typography>
        {videos.map((video) => (
          <Accordion 
            key={video.id}
            expanded={selectedVideo === video.id.toString()}
            onChange={() => setSelectedVideo(selectedVideo === video.id.toString() ? null : video.id.toString())}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>{video.title}</Typography>
                <Typography color="textSecondary" variant="body2">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </Typography>
                <Chip
                  size="small"
                  label={video.analysisStatus}
                  color={video.analysisStatus === 'Completed' ? 'success' : 'warning'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {selectedVideo === video.id.toString() && (
                <Box>
                  <video
                    controls
                    width="100%"
                    src={`http://localhost:5000/api/videos/${video.id}/stream`}
                  />
                </Box>
              )}
              <List>
                {video.performanceMetrics.map((metric, index) => (
                  <React.Fragment key={metric.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography>
                            {metricTypes.find(t => t.value === metric.metricType)?.label}:{' '}
                            {metric.value}
                            {metricTypes.find(t => t.value === metric.metricType)?.unit}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">
                              Timestamp: {metric.timestamp}s
                            </Typography>
                            {metric.notes && (
                              <Typography variant="body2">
                                Notes: {metric.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      {selectedVideo !== video.id.toString() && (
                        <Button
                          startIcon={<PlayCircleOutlineIcon />}
                          onClick={() => setSelectedVideo(video.id.toString())}
                        >
                          Watch
                        </Button>
                      )}
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
