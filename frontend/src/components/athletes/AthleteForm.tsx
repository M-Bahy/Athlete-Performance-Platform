import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Athlete } from '../../types';
import * as api from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  athlete?: Athlete;
  onSuccess: () => void;
}

export const AthleteForm: React.FC<Props> = ({
  open,
  onClose,
  athlete,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    age: 0,
  });

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name,
        sport: athlete.sport,
        age: athlete.age
      });
    } else {
      setFormData({
        name: '',
        sport: '',
        age: 0
      });
    }
  }, [athlete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (athlete) {
        await api.updateAthlete(athlete.id, formData);
      } else {
        await api.createAthlete(formData);
      }
      onSuccess(); // This will trigger the refetch event for both create and update
      onClose();
    } catch (error) {
      console.error('Error saving athlete:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{athlete ? 'Edit Athlete' : 'Add New Athlete'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="sport"
              label="Sport"
              value={formData.sport}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
              // helperText="Age must be greater than 0"
              // error={Number(formData.age) <= 0}
            />
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {athlete ? 'Save Changes' : 'Add Athlete'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
