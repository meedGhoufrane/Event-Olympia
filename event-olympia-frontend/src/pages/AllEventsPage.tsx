import { useEffect, useState } from 'react';
import { Container, SimpleGrid, Paper, Box, Title, Text, Image, Group, rem } from '@mantine/core';
import api from '../services/api';

export function AllEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/event');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <Container size="xl" py={rem(50)}>
      <Title order={1} mb={rem(30)} align="center">All Events</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={rem(30)}>
        {events.map((event) => (
          <EventCard
            key={event._id}
            title={event.name}
            date={event.date}
            location={event.location}
            image={event.image}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}

function EventCard({ title, date, location, image }) {
  return (
    <Paper
      radius="md"
      style={{
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        height: '100%',
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      }}
      withBorder
      shadow="md"
    >
      <Box style={{ position: 'relative', height: '100%' }}>
        <Image
          src={image}
          height={rem(220)}
          alt={title}
          fit="cover"
          style={{
            transition: 'transform 0.5s',
            filter: 'brightness(0.8)',
          }}
        />
        <Box p={rem(25)}>
          <Title order={4} mb={rem(15)} c="white" lineClamp={2}>{title}</Title>
          <Group gap={rem(15)} mb={rem(10)}>
            <Text size="sm" c="gray.3">{date}</Text>
          </Group>
          <Group gap={rem(15)} mb={rem(20)}>
            <Text size="sm" c="gray.3">{location}</Text>
          </Group>
        </Box>
      </Box>
    </Paper>
  );
}