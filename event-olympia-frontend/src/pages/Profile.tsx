import { useEffect, useState } from 'react';
import { Center, Paper, Title, Text, Loader, Alert } from '@mantine/core';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { userRole } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users/me'); // Fetching user info from the "me" endpoint
        setUserInfo(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  return (
    <Center style={{ minHeight: '70vh' }}>
      <Paper padding="xl" shadow="md" style={{ width: '100%', maxWidth: 400 }}>
        <Title order={2}>User Profile</Title>
        <Text>Email: {userInfo.email}</Text>
        <Text>First Name: {userInfo.firstName}</Text>
        <Text>Last Name: {userInfo.lastName}</Text>
        <Text>Role: {userRole}</Text>
      </Paper>
    </Center>
  );
} 