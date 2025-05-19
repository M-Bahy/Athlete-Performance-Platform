import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Video } from '../../types';
import * as api from '../../services/api';

interface Props {
  onAdd: () => void;
  onEdit: (video: Video) => void;
}

export const VideoList: React.FC<Props> = ({ onAdd, onEdit }) => {
  const [videos, setVideos] = useState<Video[]>([]);

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

  useEffect(() => {
    fetchVideos();
  }, []);

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

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
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
                  Athlete: {video.athlete?.name}
                </Typography>
                {video.notes && (
                  <Typography variant="body2" color="textSecondary">
                    Notes: {video.notes}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
