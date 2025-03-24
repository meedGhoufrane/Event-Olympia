import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Box,
  Group,
  Image,
  Button,
  Badge,
  Divider,
  Grid,
  Card,
  ActionIcon,
  List,
  ThemeIcon,
  Skeleton,
  Alert,
  Modal,
  Loader,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconMapPin,
  IconTicket,
  IconClock,
  IconUsers,
  IconArrowBack,
  IconCheck,
  IconAlertCircle,
  IconShare,
  IconHeart,
  IconHeartFilled,
  IconDownload,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { PDFDownloadLink, Document, Page, Text as PDFText, View, Image as PDFImage, StyleSheet } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

// Define styles for the PDF
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ticketInfo: {
    marginTop: 20,
    padding: 10,
    borderTop: '1px solid #EEEEEE',
    borderBottom: '1px solid #EEEEEE',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  qrCode: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrLabel: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

// PDF Document Template
const TicketDocument = ({ ticket, event, qrCodeDataUrl }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <PDFText style={pdfStyles.title}>EVENT TICKET</PDFText>
        <PDFText>Official Admission Ticket</PDFText>
      </View>

      <View style={pdfStyles.eventInfo}>
        <PDFText style={pdfStyles.eventName}>{event.name}</PDFText>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Date:</PDFText>
          <PDFText style={pdfStyles.value}>
            {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </PDFText>
        </View>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Time:</PDFText>
          <PDFText style={pdfStyles.value}>
            {new Date(event.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </PDFText>
        </View>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Location:</PDFText>
          <PDFText style={pdfStyles.value}>{event.location || 'TBA'}</PDFText>
        </View>
      </View>

      <View style={pdfStyles.ticketInfo}>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Ticket ID:</PDFText>
          <PDFText style={pdfStyles.value}>{ticket._id}</PDFText>
        </View>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Type:</PDFText>
          <PDFText style={pdfStyles.value}>Standard Admission</PDFText>
        </View>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Price:</PDFText>
          <PDFText style={pdfStyles.value}>${ticket.price}</PDFText>
        </View>
        <View style={pdfStyles.infoRow}>
          <PDFText style={pdfStyles.label}>Purchased:</PDFText>
          <PDFText style={pdfStyles.value}>
            {new Date(ticket.createdAt || new Date()).toLocaleDateString()}
          </PDFText>
        </View>
      </View>

      <View style={pdfStyles.qrCode}>
        {qrCodeDataUrl && <PDFImage src={qrCodeDataUrl} />}
        <PDFText style={pdfStyles.qrLabel}>
          Scan this QR code at the entrance
        </PDFText>
      </View>

      <View style={pdfStyles.footer}>
        <PDFText>This ticket is valid for one-time entry. No refunds or exchanges.</PDFText>
        <PDFText>Event ID: {event._id}</PDFText>
      </View>
    </Page>
  </Document>
);

export function SingleEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [newTicket, setNewTicket] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const response = await api.get(`/event/${eventId}`);
        setEvent(response.data);

        // Fetch related events from the same category
        if (response.data.category) {
          const relatedResponse = await api.get(`/event?category=${response.data.category}&limit=3`);
          setRelatedEvents(relatedResponse.data.filter(e => e._id !== eventId));
        }

        // Check if event is in user's favorites
        if (isAuthenticated && user) {
          try {
            const favResponse = await api.get(`/user/${user._id}/favorites`);
            setIsFavorite(favResponse.data.some(fav => fav.eventId === eventId));
          } catch (error) {
            console.error('Error fetching favorites:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [eventId, user, isAuthenticated]);

  const handleBuyTicket = async () => {
    if (!isAuthenticated || !user || !user._id) {
      alert('You must be logged in to purchase a ticket.');
      sessionStorage.setItem('pendingEventPurchase', eventId);
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token is missing');

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const ticketData = {
        eventId: eventId,
        userId: user._id,
        price: event.price || 20,
        status: 'available',
      };

      const response = await api.post('/tickets', ticketData);

      if (response.status === 201) {
        // Store the complete ticket object
        setNewTicket(response.data);

        // Generate QR code
        const qrData = JSON.stringify({
          eventId: eventId,
          ticketId: response.data._id,
          timestamp: new Date().toISOString()
        });

        const qrDataUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        setQrCodeDataUrl(qrDataUrl);
        open(); // Open success modal
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
        } else {
          alert(`Failed to purchase ticket: ${error.response.data.message || 'Server error'}`);
        }
      } else {
        alert(`Failed to purchase ticket: ${error.message || 'Please try again.'}`);
      }
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('You must be logged in to add favorites.');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token is missing');

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (isFavorite) {
        await api.delete(`/user/${user._id}/favorites/${eventId}`);
      } else {
        await api.post(`/user/${user._id}/favorites`, { eventId });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Check out this event: ${event.name}`,
        url: url,
      })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(url)
        .then(() => alert('Event link copied to clipboard!'))
        .catch((error) => console.error('Error copying link:', error));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'gray';
      case 'planning': return 'blue';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Container size="xl" py={50}>
        <Skeleton height={400} radius="md" mb={30} />
        <Skeleton height={50} radius="md" mb={20} />
        <Skeleton height={30} radius="md" mb={30} />
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Skeleton height={200} radius="md" mb={20} />
            <Skeleton height={100} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={300} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py={50}>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
        <Button
          leftIcon={<IconArrowBack size={16} />}
          variant="subtle"
          onClick={() => navigate('/events')}
          mt={20}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container size="xl" py={50}>
        <Alert icon={<IconAlertCircle size={16} />} title="Not Found" color="yellow">
          Event not found. It may have been removed or is no longer available.
        </Alert>
        <Button
          leftIcon={<IconArrowBack size={16} />}
          variant="subtle"
          onClick={() => navigate('/events')}
          mt={20}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container size="xl" py={50}>
      {/* Back Button */}
      <Button
        leftIcon={<IconArrowBack size={16} />}
        variant="subtle"
        onClick={() => navigate('/events')}
        mb={20}
      >
        Back to Events
      </Button>

      {/* Event Hero Section */}
      <Box
        sx={(theme) => ({
          position: 'relative',
          borderRadius: theme.radius.lg,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          marginBottom: 40,
        })}
      >
        <div style={{ position: 'relative' }}>
          <Image
            src={event.image}
            height={400}
            fit="cover"
            fallbackSrc="https://placehold.co/1200x400/228be6/ffffff?text=Event+Image"
            alt={event.name}
            sx={{ filter: 'brightness(0.7)' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '30px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white',
            }}
          >
            <Badge
              size="lg"
              variant="filled"
              color={getStatusColor(event.status)}
              mb={10}
            >
              {event.status || 'active'}
            </Badge>
            <Title
              order={1}
              sx={(theme) => ({
                fontSize: '2.5rem',
                fontWeight: 800,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              })}
            >
              {event.name}
            </Title>
            <Group mt={10}>
              <Badge
                size="lg"
                variant="light"
                leftSection={<IconCalendarEvent size={14} />}
              >
                {formatDate(event.date)}
              </Badge>
              <Badge
                size="lg"
                variant="light"
                leftSection={<IconMapPin size={14} />}
              >
                {event.location || 'Location TBA'}
              </Badge>
              <Badge
                size="lg"
                variant="light"
                leftSection={<IconTicket size={14} />}
              >
                ${event.price || 20}
              </Badge>
            </Group>
          </Box>
        </div>
      </Box>

      <Grid gutter={30}>
        {/* Left Column - Event Details */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder shadow="sm" radius="md" p="lg" mb={30}>
            <Group position="apart" mb={5}>
              <Title order={3}>About This Event</Title>
              <Group spacing={5}>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={handleShare}
                  aria-label="Share event"
                >
                  <IconShare size={20} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={toggleFavorite}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                </ActionIcon>
              </Group>
            </Group>

            <Divider my="md" />

            <Text size="lg">
              {event.description || 'No description available for this event.'}
            </Text>

            {event.additionalInfo && (
              <>
                <Title order={4} mt={30} mb={15}>Additional Information</Title>
                <Text>{event.additionalInfo}</Text>
              </>
            )}

            <Title order={4} mt={30} mb={15}>Event Details</Title>
            <List
              spacing="md"
              size="lg"
              icon={
                <ThemeIcon color="blue" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <strong>Category:</strong> {event.category || 'General'}
              </List.Item>
              <List.Item>
                <strong>Organizer:</strong> {event.organizer || 'Event Management Team'}
              </List.Item>
              <List.Item>
                <strong>Duration:</strong> {event.duration || '2 hours'}
              </List.Item>
              <List.Item>
                <strong>Capacity:</strong> {event.capacity || 'Limited Seating'}
              </List.Item>
            </List>
          </Card>

          {/* Related Events */}
          {relatedEvents && relatedEvents.length > 0 && (
            <Card withBorder shadow="sm" radius="md" p="lg">
              <Title order={3} mb="md">Similar Events You Might Like</Title>
              <Grid>
                {relatedEvents.map(relatedEvent => (
                  <Grid.Col key={relatedEvent._id} span={{ base: 12, sm: 6, md: 4 }}>
                    <Card
                      p="sm"
                      radius="md"
                      withBorder
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/events/${relatedEvent._id}`)}
                    >
                      <Card.Section>
                        <Image
                          src={relatedEvent.image}
                          height={120}
                          fit="cover"
                          fallbackSrc="https://placehold.co/300x120/228be6/ffffff?text=Event"
                          alt={relatedEvent.name}
                        />
                      </Card.Section>
                      <Box pt="md" pb="xs">
                        <Text fw={700} lineClamp={1}>{relatedEvent.name}</Text>
                        <Group position="apart" mt={5}>
                          <Text size="sm" color="dimmed" lineClamp={1}>
                            <IconCalendarEvent size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                            {new Date(relatedEvent.date).toLocaleDateString()}
                          </Text>
                          <Badge size="sm">${relatedEvent.price || 20}</Badge>
                        </Group>
                      </Box>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Card>
          )}
        </Grid.Col>

        {/* Right Column - Ticket Purchase */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card
            withBorder
            shadow="sm"
            radius="md"
            p="lg"
            sx={(theme) => ({
              position: 'sticky',
              top: '30px',
              background: 'linear-gradient(135deg, rgba(66, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
            })}
          >
            <Title order={3} mb="md">Get Your Tickets</Title>

            <Box mb={20}>
              <Group position="apart" mb={5}>
                <Text fw={500}>Price per ticket</Text>
                <Text fw={700} fz="xl">${event.price || 20}</Text>
              </Group>

              <Group position="apart" mb={5}>
                <Text fw={500} color="dimmed">Ticket type</Text>
                <Badge>Standard Admission</Badge>
              </Group>

              <Group position="apart" mb={5}>
                <Text fw={500} color="dimmed">
                  <IconClock size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                  Date & Time
                </Text>
                <Text>
                  {formatDate(event.date)}
                </Text>
              </Group>

              <Group position="apart" mb={5}>
                <Text fw={500} color="dimmed">
                  <IconMapPin size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                  Location
                </Text>
                <Text>
                  {event.location || 'TBA'}
                </Text>
              </Group>

              <Group position="apart" mb={5}>
                <Text fw={500} color="dimmed">
                  <IconUsers size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                  Availability
                </Text>
                <Badge color="green">Available</Badge>
              </Group>
            </Box>

            <Divider my="md" />

            <Button
              fullWidth
              size="lg"
              onClick={handleBuyTicket}
              leftIcon={<IconTicket size={20} />}
              disabled={event.status === 'completed'}
              sx={{
                background: 'linear-gradient(135deg, #4263eb 0%, #3b82f6 100%)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {event.status === 'completed' ? 'Event Completed' : 'Buy Ticket Now'}
            </Button>

            {event.status === 'planning' && (
              <Alert icon={<IconAlertCircle size={16} />} color="blue" mt={15}>
                This event is still in planning. Tickets are available for pre-purchase.
              </Alert>
            )}

            {event.status === 'completed' && (
              <Alert icon={<IconAlertCircle size={16} />} color="gray" mt={15}>
                This event has ended. Tickets are no longer available.
              </Alert>
            )}

            <Text size="sm" color="dimmed" mt={20} ta="center">
              By purchasing tickets, you agree to our terms and conditions.
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Success Modal with PDF */}
      <Modal
        opened={opened}
        onClose={close}
        title="Ticket Purchased Successfully!"
        centered
        size="md"
      >
        <Box ta="center" py={20}>
          <ThemeIcon color="green" size={60} radius={30} mb={20}>
            <IconCheck size={30} />
          </ThemeIcon>
          <Title order={3} mb={10}>Thank You For Your Purchase!</Title>
          <Text size="lg" mb={20}>
            Your ticket for "{event.name}" has been confirmed.
          </Text>

          {newTicket && qrCodeDataUrl ? (
            <Box mt={30}>
              <PDFDownloadLink
                document={<TicketDocument ticket={newTicket} event={event} qrCodeDataUrl={qrCodeDataUrl} />}
                fileName={`ticket-${event.name.replace(/\s+/g, '-').toLowerCase()}-${newTicket._id.slice(-6)}.pdf`}
                style={{ textDecoration: 'none' }}
              >
                {({ loading, error }) => (
                  <Button
                    fullWidth
                    leftIcon={<IconDownload size={16} />}
                    loading={loading}
                    disabled={loading || error}
                  >
                    {loading ? 'Generating PDF...' : 'Download Your Ticket'}
                  </Button>
                )}
              </PDFDownloadLink>
              <Text color="dimmed" size="sm" mt={10}>
                Save this ticket or download it to your device. You'll need to present it at the event.
              </Text>
            </Box>
          ) : (
            <Box mt={30}>
              <Loader size="md" />
              <Text color="dimmed" mt={10}>Preparing your ticket...</Text>
            </Box>
          )}

          <Button
            variant="subtle"
            onClick={close}
            mt={30}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}