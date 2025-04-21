import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const DoctorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['doctorAppointments'],
    queryFn: async () => {
      const response = await axios.get('/api/doctor/appointments');
      return response.data;
    },
  });

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['doctorPatients'],
    queryFn: async () => {
      const response = await axios.get('/api/doctor/patients');
      return response.data;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/doctor/notes', data);
      return response.data;
    },
    onSuccess: () => {
      setOpenDialog(false);
      setSelectedPatient(null);
    },
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleAddNote = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    addNoteMutation.mutate({
      patientId: selectedPatient.id,
      note: formData.get('note'),
    });
  };

  if (appointmentsLoading || patientsLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Doctor Dashboard
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Today's Appointments" />
            <Tab label="My Patients" />
          </Tabs>

          {selectedTab === 0 && (
            <List>
              {appointments?.map((appointment) => (
                <ListItem
                  key={appointment.id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(appointment.patient)}
                    >
                      Add Note
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={appointment.patient.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon fontSize="small" />
                        {new Date(appointment.date).toLocaleDateString()}
                        <TimeIcon fontSize="small" />
                        {appointment.time}
                      </Box>
                    }
                  />
                  <Chip
                    label={appointment.status}
                    color={
                      appointment.status === 'Confirmed'
                        ? 'success'
                        : appointment.status === 'Pending'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}

          {selectedTab === 1 && (
            <Grid container spacing={2}>
              {patients?.map((patient) => (
                <Grid item xs={12} sm={6} md={4} key={patient.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{patient.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.age} years old
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog(patient)}
                      >
                        Add Medical Note
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleAddNote}>
          <DialogTitle>Add Medical Note</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              Patient: {selectedPatient?.name}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              name="note"
              label="Medical Note"
              type="text"
              fullWidth
              multiline
              rows={4}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={addNoteMutation.isPending}>
              {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard; 