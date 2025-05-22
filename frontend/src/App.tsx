import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Button,
  ThemeProvider,
  createTheme,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { AthleteList } from './components/athletes/AthleteList';
import { AthleteForm } from './components/athletes/AthleteForm';
import { AthleteProfile } from './components/athletes/AthleteProfile';
import { VideoList } from './components/videos/VideoList';
import { VideoForm } from './components/videos/VideoForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { Login } from './components/auth/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function MainApp() {
  const [athleteFormOpen, setAthleteFormOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>();
  const [videoFormOpen, setVideoFormOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>();
  const { isAuthenticated, username, logout, login, error } = useAuth();

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
    const event = new Event('refetchAthletes');
    window.dispatchEvent(event);
  };

  const handleVideoSuccess = () => {
    setVideoFormOpen(false);
    const event = new Event('refetchVideos');
    window.dispatchEvent(event);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        {isAuthenticated && (
          <AppBar position="static">
            <Toolbar>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ mr: 2 }}
              >
                Dashboard
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={1}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/athletes"
                  startIcon={<SportsKabaddiIcon />}
                >
                  Athletes
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/videos"
                  startIcon={<PlayCircleIcon />}
                >
                  Videos
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {username}
                  </Typography>
                  <IconButton color="inherit" onClick={logout} size="small">
                    <LogoutIcon />
                  </IconButton>
                </Box>
              </Stack>
            </Toolbar>
          </AppBar>
        )}

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={login} error={error || undefined} />
            } />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/athletes"
                element={
                  <AthleteList
                    onAdd={handleAddAthlete}
                    onEdit={handleEditAthlete}
                  />
                }
              />
              <Route path="/athlete/:id" element={<AthleteProfile />} />
              <Route
                path="/videos"
                element={
                  <VideoList
                    onAdd={handleAddVideo}
                    onEdit={handleEditVideo}
                  />
                }
              />
            </Route>
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
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
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
