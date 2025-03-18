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

// Category icon
const TagIcon = ({ size = 18, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
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
              category={event.category || "Event"} // Add category if available
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

function EventCard({ title, date, location, image, category = "Event" }) {
  // Format date nicely
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  // Month and day for the date badge
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const day = eventDate.getDate();

  // Random gradient for category badge (ensures consistent colors for same categories)
  const categoryColors = {
    "Concert": { from: 'indigo', to: 'blue' },
    "Conference": { from: 'violet', to: 'indigo' },
    "Workshop": { from: 'pink', to: 'violet' },
    "Festival": { from: 'orange', to: 'yellow' },
    "Meetup": { from: 'teal', to: 'green' },
    "Event": { from: 'blue', to: 'cyan' }
  };
  
  const gradient = categoryColors[category] || categoryColors.Event;

  return (
    <Paper
      radius="lg"
      style={{
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        height: '100%',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        },
      }}
      className="event-card"
      h={rem(420)}
      withBorder={false}
    >
      <Box style={{ position: 'relative', height: '100%' }}>
        {/* Image container with overlay gradient */}
        <Box style={{ position: 'relative' }}>
          <Image
            src={image}
            height={rem(220)}
            alt={title}
            fit="cover"
            style={{
              transition: 'transform 0.6s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            className="event-image"
          />
          
          {/* Overlay gradient for better text contrast */}
          <Box 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
              zIndex: 1
            }}
          />
          
          {/* Category Badge */}
          <Badge 
            variant="gradient"
            gradient={gradient}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 2,
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              padding: '0.5rem 0.75rem',
            }}
            size="lg"
          >
            <Group spacing={4}>
              <TagIcon size={14} color="white" />
              <Text size="xs" fw={600}>{category}</Text>
            </Group>
          </Badge>
          
          {/* Date Badge */}
          <Box
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 2,
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '0.5rem',
              minWidth: '60px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Text style={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1, color: '#1c7ed6' }}>
              {day}
            </Text>
            <Text style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#495057', fontWeight: 600 }}>
              {month}
            </Text>
          </Box>
        </Box>
        
        {/* Content */}
        <Box p={rem(25)} style={{ backgroundColor: 'white', height: 'calc(100% - 220px)', display: 'flex', flexDirection: 'column' }}>
          <Title order={3} mb={rem(15)} lineClamp={2} style={{ fontSize: rem(20), lineHeight: 1.3 }}>{title}</Title>
          
          <Group gap={rem(15)} mb={rem(15)}>
            <Group gap={rem(8)}>
              <ClockIcon size={18} color="#4dabf7" />
              <Text size="sm" c="gray.7">{formattedDate}</Text>
            </Group>
          </Group>
          
          <Group gap={rem(15)} mb={rem(15)}>
            <Group gap={rem(8)}>
              <MapPinIcon size={18} color="#4dabf7" />
              <Text size="sm" c="gray.7">{location}</Text>
            </Group>
          </Group>
          
          {/* Spacer to push button to bottom */}
          <Box style={{ flexGrow: 1 }} />
          
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            radius="xl"
            size="md"
            fullWidth
            style={{
              boxShadow: '0 4px 14px rgba(0, 120, 220, 0.3)',
              transition: 'all 0.3s ease',
              marginTop: 'auto',
            }}
            className="view-details-button"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 120, 220, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 120, 220, 0.3)';
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}