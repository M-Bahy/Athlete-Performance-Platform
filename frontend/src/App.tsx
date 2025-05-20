import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { AthleteList } from './components/athletes/AthleteList';
import { AthleteForm } from './components/athletes/AthleteForm';
import { VideoList } from './components/videos/VideoList';
import { VideoForm } from './components/videos/VideoForm';
import { Athlete, Video } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [athleteFormOpen, setAthleteFormOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>();
  const [videoFormOpen, setVideoFormOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>();

  const handleAddAthlete = () => {
    setSelectedAthlete(undefined);
    setAthleteFormOpen(true);
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setAthleteFormOpen(true);
  };

  const handleAddVideo = () => {
    setSelectedVideo(undefined);
    setVideoFormOpen(true);
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setVideoFormOpen(true);
  };

  const handleAthleteSuccess = () => {
    setAthleteFormOpen(false);
    // If we have an AthleteList mounted, it will refetch
    const event = new Event('refetchAthletes');
    window.dispatchEvent(event);
  };

  const handleVideoSuccess = () => {
    setVideoFormOpen(false);
    const event = new Event('refetchVideos');
    window.dispatchEvent(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Athlete Performance Platform
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Athletes
              </Button>
              <Button color="inherit" component={Link} to="/videos">
                Videos
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <AthleteList
                    onAdd={handleAddAthlete}
                    onEdit={handleEditAthlete}
                  />
                }
              />
              <Route
                path="/videos"
                element={
                  <VideoList
                    onAdd={handleAddVideo}
                    onEdit={handleEditVideo}
                  />
                }
              />
            </Routes>
          </Container>

          <AthleteForm
            open={athleteFormOpen}
            onClose={() => setAthleteFormOpen(false)}
            athlete={selectedAthlete}
            onSuccess={handleAthleteSuccess}
          />

          <VideoForm
            open={videoFormOpen}
            onClose={() => setVideoFormOpen(false)}
            video={selectedVideo}
            onSuccess={handleVideoSuccess}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
