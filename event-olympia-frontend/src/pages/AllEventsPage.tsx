import { useEffect, useState, useContext } from 'react';
import { Container, SimpleGrid, Title, Text, Box, Group, Center, Loader, Button, TextInput, SegmentedControl, Card } from '@mantine/core';
import { IconSearch, IconCheck, IconClock } from '@tabler/icons-react'; // Icons for better UX
import api from '../services/api';
import EventCard from '../components/homecontent/EventCard';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AllEventsPage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null); // Status filter (null means no filter)
  const [searchQuery, setSearchQuery] = useState(''); // Search by event name

  // Fetch events from the backend
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await api.get('/event');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter events based on status and search query
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Toggle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value === 'all' ? null : value); // Reset filter if 'all' is selected
  };

  // Handle buying a ticket
  const handleBuyTicket = async (eventId) => {
    console.log("Buy ticket clicked. Auth state:", { isAuthenticated, user });
    if (!isAuthenticated || !user || !user._id) {
      console.log("User not authenticated or missing valid ID");
      alert('You must be logged in to purchase a ticket.');
      sessionStorage.setItem('pendingEventPurchase', eventId);
      navigate('/login');
      return;
    }
    const isValidObjectId = typeof user._id === 'string' && /^[0-9a-fA-F]{24}$/.test(user._id);
    if (!isValidObjectId) {
      alert('Your user profile appears to be incomplete. Please log out and log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authentication token is missing');
      }
      const event = events.find(e => e._id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      const price = event.price || 20;

      const ticketData = {
        eventId: eventId,
        userId: user._id, 
        price: price,
        status: 'available',
      };

      const response = await api.post('/tickets', ticketData);

      if (response.status === 201) {
        alert('Ticket purchased successfully!');
      } else {
        alert('Failed to purchase ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);

      if (error.response) {
        if (error.response.status === 401) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          sessionStorage.setItem('pendingEventPurchase', eventId);
          navigate('/login');
        } else if (error.response.status === 400) {
          alert(`Failed to purchase ticket: ${error.response.data.message || 'Invalid request'}`);
        } else {
          alert(`Failed to purchase ticket: ${error.response.data.message || 'Server error'}`);
        }
      } else if (error.message) {
        alert(`Failed to purchase ticket: ${error.message}`);
      } else {
        alert('Failed to purchase ticket. Please try again.');
      }
    }
  };

  // Handle pending ticket purchase after login
  useEffect(() => {
    const pendingEventId = sessionStorage.getItem('pendingEventPurchase');
    if (pendingEventId && isAuthenticated && user && !loading) {
      sessionStorage.removeItem('pendingEventPurchase');
      const isValidObjectId = typeof user._id === 'string' && /^[0-9a-fA-F]{24}$/.test(user._id);
      if (!isValidObjectId) {
          alert('Your user profile appears to be incomplete. Please log out and log in again.');
        return;
      }

      const shouldProceed = window.confirm('Would you like to complete your ticket purchase?');
      if (shouldProceed) {
        handleBuyTicket(pendingEventId);
      }
    }
  }, [isAuthenticated, user, loading]);

  return (
    <Container size="xl" py={50}>
      {/* Header */}
      <Box
        mb={40}
        py={30}
        sx={(theme) => ({
          borderRadius: theme.radius.lg,
          background: 'linear-gradient(135deg, rgba(66, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        })}
      >
        <Title
          order={1}
          align="center"
          sx={(theme) => ({
            fontSize: '2.5rem',
            marginBottom: theme.spacing.md,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4263eb 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          })}
        >
          Discover Amazing Events
        </Title>
        <Text
          align="center"
          size="lg"
          color="dimmed"
          sx={{ maxWidth: 600, margin: '0 auto' }}
        >
          Find and book tickets for the hottest events happening in your area
        </Text>
      </Box>

      {/* Filters Section */}
      <Card withBorder shadow="sm" radius="md" p="lg" mb={30}>
        <Group position="apart" align="flex-end">
          {/* Search by event name */}
          <TextInput
            placeholder="Search by event name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<IconSearch size={18} />}
            sx={{ flex: 1 }}
          />

          {/* Status filter */}
          <SegmentedControl
            value={statusFilter || 'all'}
            onChange={handleStatusFilter}
            data={[
              { label: 'All', value: 'all', icon: <IconCheck size={16} /> },
              { label: 'Active', value: 'active', icon: <IconCheck size={16} /> },
              { label: 'Completed', value: 'completed', icon: <IconCheck size={16} /> },
              { label: 'Planning', value: 'planning', icon: <IconClock size={16} /> },
            ]}
          />
        </Group>
      </Card>

      {/* Loading state */}
      {loading && (
        <Center my={50}>
          <Loader size="xl" color="blue" variant="dots" />
        </Center>
      )}

      {/* Error state */}
      {error && (
        <Center my={50}>
          <Text color="red" size="lg">{error}</Text>
        </Center>
      )}

      {/* Empty state */}
      {!loading && !error && filteredEvents.length === 0 && (
        <Center my={50} sx={{ flexDirection: 'column' }}>
          <Text color="dimmed" size="lg" mb={10}>No events found for this status.</Text>
          {statusFilter !== 'all' && (
            <Button
              variant="subtle"
              color="blue"
              onClick={() => setStatusFilter(null)} // Reset filter
            >
              View all events
            </Button>
          )}
        </Center>
      )}

      {/* Events grid */}
      {!loading && !error && filteredEvents.length > 0 && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing={30}
          verticalSpacing={40}
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              eventId={event._id}
              title={event.name}
              date={event.date}
              location={event.location}
              image={`/uploads/${event.image}`}
              price={event.price || 20}
              category={event.category || 'Event'}
              status={event.status || 'planning'} // Add status prop
              onBuyTicket={handleBuyTicket}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}