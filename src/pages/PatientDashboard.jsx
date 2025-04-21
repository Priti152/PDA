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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalServicesIcon,
  LocalHospital as HospitalIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PatientDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const { data: patientInfo, isLoading: infoLoading } = useQuery({
    queryKey: ['patientInfo'],
    queryFn: async () => {
      const response = await axios.get('/api/patient/info');
      return response.data;
    },
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: async () => {
      const response = await axios.get('/api/patient/appointments');
      return response.data;
    },
  });

  const { data: medicalRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['patientRecords'],
    queryFn: async () => {
      const response = await axios.get('/api/patient/records');
      return response.data;
    },
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (infoLoading || appointmentsLoading || recordsLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5">{patientInfo?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {patientInfo?.id}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Age
                  </Typography>
                  <Typography variant="body1">{patientInfo?.age}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">{patientInfo?.gender}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Blood Type
                  </Typography>
                  <Typography variant="body1">{patientInfo?.bloodType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Last Visit
                  </Typography>
                  <Typography variant="body1">
                    {new Date(patientInfo?.lastVisit).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Appointments" />
                <Tab label="Medical Records" />
              </Tabs>

              {selectedTab === 0 && (
                <List>
                  {appointments?.map((appointment) => (
                    <ListItem
                      key={appointment.id}
                      secondaryAction={
                        <Chip
                          label={appointment.status}
                          color={
                            appointment.status === 'Confirmed'
                              ? 'success'
                              : appointment.status === 'Pending'
                              ? 'warning'
                              : 'error'
                          }
                        />
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <MedicalServicesIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.doctor.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" />
                            {new Date(appointment.date).toLocaleDateString()}
                            <TimeIcon fontSize="small" />
                            {appointment.time}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {selectedTab === 1 && (
                <Box>
                  {medicalRecords?.map((record) => (
                    <Accordion key={record.id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <HospitalIcon color="primary" />
                          <Box>
                            <Typography variant="subtitle1">
                              {new Date(record.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Dr. {record.doctor.name}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" paragraph>
                          {record.diagnosis}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Treatment
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {record.treatment}
                        </Typography>
                        {record.prescription && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" gutterBottom>
                              Prescription
                            </Typography>
                            <Typography variant="body2">{record.prescription}</Typography>
                          </>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard; 