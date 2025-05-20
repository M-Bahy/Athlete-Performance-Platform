import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Athlete } from '../../types';
import * as api from '../../services/api';

interface Props {
  onAdd: () => void;
  onEdit: (athlete: Athlete) => void;
}

export const AthleteList: React.FC<Props> = ({ onAdd, onEdit }) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  const fetchAthletes = async () => {
    try {
      const response = await api.getAthletes();
      setAthletes(response.data);
    } catch (error) {
      console.error('Error fetching athletes:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this athlete?')) {
      try {
        await api.deleteAthlete(id);
        fetchAthletes();
      } catch (error) {
        console.error('Error deleting athlete:', error);
      }
    }
  };

  useEffect(() => {
    fetchAthletes();

    // Add event listener for refetch
    const handleRefetch = () => fetchAthletes();
    window.addEventListener('refetchAthletes', handleRefetch);

    // Cleanup
    return () => {
      window.removeEventListener('refetchAthletes', handleRefetch);
    };
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Athletes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add Athlete
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Age</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {athletes.map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell>{athlete.name}</TableCell>
                <TableCell>{athlete.sport}</TableCell>
                <TableCell>{athlete.age}</TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(athlete)}
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(athlete.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
