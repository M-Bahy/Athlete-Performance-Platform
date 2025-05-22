// src/components/dashboard/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Paper,
  
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  AccountCircle as ProfileIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, subDays } from 'date-fns';
import { Athlete, Video } from '../../types';
import * as api from '../../services/api';

interface AthleteWithData extends Athlete {
  recentVideos: Video[];
  performanceMetrics: {
    sprintTime: { best: number; average: number; total: number };
    jumpHeight: { best: number; average: number; total: number };
  };
}

const metricTypes = [
  { value: 'sprint_time', label: 'Sprint Time', unit: 's' },
  { value: 'jump_height', label: 'Jump Height', unit: 'cm' },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<AthleteWithData[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteWithData[]>([]);
  const [uniqueSports, setUniqueSports] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [loading, setLoading] = useState(true);

  const calculateMetrics = (videos: Video[]) => {
    const allMetrics = videos.flatMap(v => v.performanceMetrics || []);
    
    const calculateStats = (type: string) => {
      const metrics = allMetrics.filter(m => m.metricType === type);
      if (metrics.length === 0) return { best: 0, average: 0, total: 0 };
      
      const values = metrics.map(m => m.value);
      return {
        best: type === 'sprint_time' ? Math.min(...values) : Math.max(...values),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        total: values.length
      };
    };

    return {
      sprintTime: calculateStats('sprint_time'),
      jumpHeight: calculateStats('jump_height')
    };
  };

  const fetchData = async () => {
    try {
      const [athletesRes, videosRes] = await Promise.all([
        api.getAthletes(),
        api.getVideos()
      ]);

      const sports = [...new Set(athletesRes.data.map(a => a.sport))];
      setUniqueSports(sports);

      const processedAthletes = await Promise.all(athletesRes.data.map(async (athlete) => {
        const athleteVideos = videosRes.data.filter(v => v.athleteId === athlete.id);

        const videosWithMetrics = await Promise.all(
          athleteVideos.map(async (video) => {
            const metricsRes = await api.getMetricsByVideo(video.id);
            return { ...video, performanceMetrics: metricsRes.data };
          })
        );

        return {
          ...athlete,
          recentVideos: videosWithMetrics.sort((a, b) => 
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          ).slice(0, 3),
          performanceMetrics: calculateMetrics(videosWithMetrics)
        };
      }));

      setAthletes(processedAthletes);
      setFilteredAthletes(processedAthletes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...athletes];
    
    if (selectedSport) {
      filtered = filtered.filter(a => a.sport === selectedSport);
    }

    filtered = filtered.filter(athlete => {
      return athlete.recentVideos.some(video => {
        const uploadDate = new Date(video.uploadDate);
        return uploadDate >= dateRange.start && uploadDate <= dateRange.end;
      });
    });

    setFilteredAthletes(filtered);
  }, [selectedSport, dateRange, athletes]);

  const handleClearFilters = () => {
    setSelectedSport('');
    setDateRange({
      start: subDays(new Date(), 30),
      end: new Date(),
    });
    setFilteredAthletes(athletes);
  };

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Athletes Performance Dashboard
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={12} {...({} as any)}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                select
                fullWidth
                label="Filter by Sport"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Sports</MenuItem>
                {uniqueSports.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </TextField>
              <Button 
                variant="outlined" 
                onClick={handleClearFilters}
                size="small"
              >
                Clear Filters
              </Button>
            </Stack>
          </Grid>
      
          {/* Date Pickers */}
          <Grid item xs={12} sm={12} {...({} as any)}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDateRange(prev => ({ ...prev, start: newValue }));
                    }
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDateRange(prev => ({ ...prev, end: newValue }));
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredAthletes.map((athlete) => (
          // <Grid item xs={12} sm={4} {...({} as any)}>

          <Grid item xs={12} sm={6} md={4} key={athlete.id} {...({} as any)}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{athlete.name}</Typography>
                  <Chip label={athlete.sport} color="primary" size="small" />
                </Stack>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Performance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} {...({} as any)}>

                      <Paper sx={{ p: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Best Sprint Time
                        </Typography>
                        <Typography variant="h6">
                          {athlete.performanceMetrics.sprintTime.best > 0 
                            ? `${athlete.performanceMetrics.sprintTime.best}s`
                            : 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} {...({} as any)}>
                      <Paper sx={{ p: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Best Jump Height
                        </Typography>
                        <Typography variant="h6">
                          {athlete.performanceMetrics.jumpHeight.best > 0
                            ? `${athlete.performanceMetrics.jumpHeight.best}cm`
                            : 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Recent Videos
                </Typography>
                <Stack spacing={1}>
                  {athlete.recentVideos.map((video) => (
                    <Paper variant="outlined" key={video.id} sx={{ p: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {video.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                          {format(new Date(video.uploadDate), 'MMM d, yyyy')}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
              <CardActions>
                <Button 
                  size="small"
                  startIcon={<TimelineIcon />}
                  onClick={() => navigate(`/athlete/${athlete.id}`)}
                >
                  More Insights
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

