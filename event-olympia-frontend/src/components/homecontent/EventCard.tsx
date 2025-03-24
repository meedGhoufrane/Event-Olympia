import { useNavigate } from 'react-router-dom';
import { Card, Image, Text, Badge, Button, Group, Box } from '@mantine/core';
import { IconCalendarEvent, IconMapPin, IconTicket } from '@tabler/icons-react';

export default function EventCard({ 
  eventId, 
  title, 
  date, 
  location, 
  image, 
  price, 
  status, 
  onBuyTicket 
}) {
  const navigate = useNavigate();
  
  const handleCardClick = (e) => {
    // Prevent navigation if clicking the buy ticket button
    if (e.target.closest('button')) return;
    navigate(`/events/${eventId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'gray';
      case 'planning': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Card 
      withBorder 
      radius="md" 
      p="md" 
      onClick={handleCardClick}
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Card.Section>
        <Image
          src={image}
          height={180}
          alt={title}
          withPlaceholder
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text fw={600} fz="lg" lineClamp={1}>
          {title}
        </Text>
        <Badge color={getStatusColor(status)} variant="light">
          {status}
        </Badge>
      </Group>

      <Group spacing={5} mt={5}>
        <IconCalendarEvent size={16} color="#228be6" />
        <Text size="sm" color="dimmed">
          {formatDate(date)}
        </Text>
      </Group>

      <Group spacing={5} mt={5}>
        <IconMapPin size={16} color="#228be6" />
        <Text size="sm" color="dimmed" lineClamp={1}>
          {location || 'Location TBA'}
        </Text>
      </Group>

      <Group position="apart" mt="md">
        <Badge 
          size="lg" 
          variant="filled" 
          leftSection={<IconTicket size={14} />}
          sx={{ 
            background: 'linear-gradient(135deg, #4263eb 0%, #3b82f6 100%)',
          }}
        >
          ${price}
        </Badge>
        <Button 
          variant="light" 
          color="blue" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onBuyTicket(eventId);
          }}
          disabled={status === 'completed'}
        >
          {status === 'completed' ? 'Completed' : 'Buy Ticket'}
        </Button>
      </Group>
    </Card>
  );
}