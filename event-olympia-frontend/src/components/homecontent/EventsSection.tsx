import { useEffect, useState } from 'react';
import { Title, Text, Badge, Container, SimpleGrid, Paper, Box, Group, Button, Image, Stack, rem } from '@mantine/core';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Import the API service

// SVG icons for event cards
const ClockIcon = ({ size = 18, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = ({ size = 18, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/event?limit=3'); 
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <Box
      py={rem(100)}
      w="100%"
      style={{
        background: 'rgba(7, 15, 35, 0.4)',
        backdropFilter: 'blur(10px)',
        width: '100%'
      }}
    >
      <Container size="xl" style={{ width: '100%', maxWidth: '100%' }} px={rem(30)}>
        <Stack align="center" mb={rem(60)} w="100%">
          <Badge
            size="lg"
            radius="xl"
            color="blue"
            variant="filled"
            style={{
              boxShadow: '0 2px 8px rgba(37, 150, 255, 0.3)',
            }}
          >
            Upcoming Events
          </Badge>
          <Title order={2} c="white" ta="center" size={rem(42)} fw={800}>
            Don't Miss These Opportunities
          </Title>
          <Text c="gray.4" ta="center" mt={rem(15)}>
            Check out our featured upcoming events and secure your spot today
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 3 }} spacing={rem(30)}>
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
        
        <Group justify="center" mt={rem(50)}>
          <Button
            component={Link}
            to="/events"
            size="lg"
            radius="xl"
            variant="outline"
            color="gray.0"
            px={rem(40)}
            style={{
              borderWidth: 2,
              transition: 'background-color 0.3s, color 0.3s',
            }}
            className="view-all-button"
          >
            View All Events
          </Button>
        </Group>
      </Container>
    </Box>
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
      }}
      className="event-card"
      h={rem(380)}
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
          }}
          className="event-image"
        />
        <Box p={rem(25)}>
          <Title order={4} mb={rem(15)} c="white" lineClamp={2}>{title}</Title>

          <Group gap={rem(15)} mb={rem(10)}>
            <Group gap={rem(8)}>
              <ClockIcon size={18} />
              <Text size="sm" c="gray.3">{date}</Text>
            </Group>
          </Group>

          <Group gap={rem(15)} mb={rem(20)}>
            <Group gap={rem(8)}>
              <MapPinIcon size={18} />
              <Text size="sm" c="gray.3">{location}</Text>
            </Group>
          </Group>

          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            radius="xl"
            fullWidth
            style={{
              boxShadow: '0 4px 10px rgba(0, 120, 220, 0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            className="view-details-button"
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}