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

// Styles for EventCard
const styles = {
  eventCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    height: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
    }
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden'
  },
  eventImage: {
    transition: 'transform 0.7s ease',
    height: '220px',
    objectFit: 'cover',
    width: '100%',
    '&:hover': {
      transform: 'scale(1.1)',
    }
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
    zIndex: 1
  },
  dateBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '8px',
    minWidth: '65px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 2
  },
  categoryBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    zIndex: 2,
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
    padding: '8px 12px'
  },
  contentContainer: {
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 220px)'
  },
  title: {
    fontSize: '22px',
    lineHeight: 1.3,
    marginBottom: '16px',
    fontWeight: 700,
    color: '#1a1b1e'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  },
  metaText: {
    fontSize: '14px',
    color: '#495057'
  },
  viewButton: {
    marginTop: 'auto',
    borderRadius: '50px',
    fontWeight: 600,
    padding: '12px 20px',
    transition: 'all 0.3s ease',
    width: '100%',
    boxShadow: '0 4px 14px rgba(0, 120, 220, 0.3)',
    background: 'linear-gradient(135deg, #2979ff 0%, #38b6ff 100%)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(0, 120, 220, 0.4)',
    }
  }
};

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
              category={event.category || "Event"}
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
      className="event-card"
      h={rem(420)}
      withBorder={false}
      style={{
        ...styles.eventCard,
        height: '100%',
        cursor: 'pointer',
      }}
    >
      <Box style={{ position: 'relative', height: '100%' }}>
        {/* Image container with overlay gradient */}
        <Box style={styles.imageContainer}>
          <Image
            src={image}
            height={rem(220)}
            alt={title}
            fit="cover"
            className="event-image"
            style={styles.eventImage}
          />
          
          {/* Overlay gradient for better text contrast */}
          <Box className="image-overlay" style={styles.imageOverlay} />
          
          {/* Category Badge */}
          <Badge 
            variant="gradient"
            gradient={gradient}
            className="event-category-badge"
            style={styles.categoryBadge}
            size="lg"
          >
            <Group spacing={4}>
              <TagIcon size={14} color="white" />
              <Text size="xs" fw={600}>{category}</Text>
            </Group>
          </Badge>
          
          {/* Date Badge */}
          <Box
            className="event-date-badge"
            style={styles.dateBadge}
          >
            <Text className="event-date-day" style={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1, color: '#1c7ed6' }}>
              {day}
            </Text>
            <Text className="event-date-month" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#495057', fontWeight: 600 }}>
              {month}
            </Text>
          </Box>
        </Box>
        
        {/* Content */}
        <Box className="event-content" style={styles.contentContainer}>
          <Title order={3} className="event-title" lineClamp={2} style={styles.title}>{title}</Title>
          
          <Group className="event-meta" style={styles.metaItem}>
            <ClockIcon size={18} color="#4dabf7" />
            <Text className="event-meta-text" style={styles.metaText}>{formattedDate}</Text>
          </Group>
          
          <Group className="event-meta" style={styles.metaItem}>
            <MapPinIcon size={18} color="#4dabf7" />
            <Text className="event-meta-text" style={styles.metaText}>{location}</Text>
          </Group>
          
          {/* Spacer to push button to bottom */}
          <Box style={{ flexGrow: 1 }} />
          
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            radius="xl"
            size="md"
            fullWidth
            className="view-details-button"
            style={styles.viewButton}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}