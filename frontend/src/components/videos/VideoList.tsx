import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Video } from '../../types';
import * as api from '../../services/api';
import { PerformanceMetrics } from './PerformanceMetrics';

interface Props {
  onAdd: () => void;
  onEdit: (video: Video) => void;
}

export const VideoList: React.FC<Props> = ({ onAdd, onEdit }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>();
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);

  const fetchVideos = async () => {
    try {
      const response = await api.getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.deleteVideo(id);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleUserInputPerformanceMetrics = (video: Video) => {
    setSelectedVideo(video);
    setMetricsDialogOpen(true);
  };

  useEffect(() => {
    fetchVideos();

    const intervalId = setInterval(() => {
      const hasProcessingVideos = videos.some(
        video => video.analysisStatus === 'Processing'
      );

      if (hasProcessingVideos) {
        fetchVideos();
      }
    }, 10000);
    
    const handleRefetch = () => fetchVideos();
    window.addEventListener('refetchVideos', handleRefetch);

    // Cleanup
    return () => {
      window.removeEventListener('refetchVideos', handleRefetch);
      clearInterval(intervalId);
    };
  }, [videos]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Performance Videos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Upload Video
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {videos.map((video) => (
          <Box
            key={video.id}
            sx={{ 
              width: {
                xs: '100%',
                sm: 'calc(50% - 24px)',
                md: 'calc(33.333% - 24px)'
              }
            }}
          >
            <Card>
              <CardMedia
                component="video"
                controls
                src={`http://localhost:5000/api/videos/${video.id}/stream`}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Athlete: {video.athlete ? video.athlete.name : 'Unknown'}
                </Typography>
                {video.notes && (
                  <Typography variant="body2" color="textSecondary">
                    Notes: {video.notes}
                  </Typography>
                )}
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Typography variant="body2" color="textSecondary">
                    Analysis status:
                  </Typography>
                  <Chip
                    size="small"
                    label={video.analysisStatus || 'Unknown'}
                    color={video.analysisStatus === 'Completed' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<EmojiEventsIcon />}
                  onClick={() => handleUserInputPerformanceMetrics(video)}
                >
                  Performance
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(video)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(video.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <PerformanceMetrics
        open={metricsDialogOpen}
        onClose={() => {
          setMetricsDialogOpen(false);
          setSelectedVideo(undefined);
        }}
        video={selectedVideo}
      />
    </Box>
  );
};