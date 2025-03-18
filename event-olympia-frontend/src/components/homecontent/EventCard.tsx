import React from 'react';
import { Paper, Box, Title, Text, Group, Button, Image, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function EventCard({ 
  eventId, 
  title, 
  date, 
  location, 
  image, 
  price = 20, 
  category = "Event", 
  status = "planning", 
  onBuyTicket 
}) {
  const navigate = useNavigate();
  
  // Format date nicely
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  const handleBuyTicket = () => {
    // Navigate to ticket purchase page or open modal
    navigate(`/events/${eventId}/tickets`);
  };
  
  // Gradient colors for category badges
  const getCategoryColor = (category) => {
    const categories = {
      "Concert": { from: 'indigo', to: 'blue' },
      "Festival": { from: 'pink', to: 'violet' },
      "Workshop": { from: 'orange', to: 'yellow' },
      "Conference": { from: 'teal', to: 'green' },
      "Exhibition": { from: 'red', to: 'orange' }
    };
    
    return categories[category] || { from: 'blue', to: 'cyan' };
  };

  return (
    <Paper
      radius="lg"
      shadow="md"
      sx={(theme) => ({
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows.xl,
          '& .event-image': {
            transform: 'scale(1.05)',
          },
          '& .buy-button': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(66, 99, 235, 0.3)',
          }
        },
      })}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
        <Image
          src={image || '/placeholder-event.jpg'}
          height={220}
          alt={title}
          fit="cover"
          className="event-image"
          sx={{
            transition: 'transform 0.5s ease',
          }}
        />
        
        {/* Category Badge */}
        <Badge 
          variant="gradient"
          gradient={getCategoryColor(category)}
          size="lg"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          {category}
        </Badge>
        
        {/* Status Badge */}
        <Badge 
          variant="light"
          color={
            status === 'active' ? 'green' :
            status === 'completed' ? 'red' :
            'blue'
          }
          size="sm"
          sx={{
            position: 'absolute',
            top: 12,
            right: 80,
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          {status}
        </Badge>
        
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'white',
            borderRadius: '50%',
            width: 64,
            height: 64,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 2,
          })}
        >
          <Text fw={800} fz={20} lh={1} mb={2} color="blue.7">
            {eventDate.getDate()}
          </Text>
          <Text fz={12} tt="uppercase" c="dimmed" fw={500}>
            {eventDate.toLocaleString('default', { month: 'short' })}
          </Text>
        </Box>
      </Box>
      
      {/* Content */}
      <Box p="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Title order={3} lineClamp={2} mb="md" sx={{ lineHeight: 1.3 }}>
          {title}
        </Title>
        
        <Group position="apart" mb="lg">
          <Group spacing="xs" align="center">
            <Box component="svg" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" c="blue.6">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </Box>
            <Text size="sm" c="dimmed" fw={500}>{location}</Text>
          </Group>
          
          <Group spacing="xs" align="center">
            <Box component="svg" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" c="blue.6">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </Box>
            <Text size="sm" c="dimmed" fw={500}>{formattedDate}</Text>
          </Group>
        </Group>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Group position="apart" align="center" mt="md">
          <Box>
            <Text fz="xs" c="dimmed" tt="uppercase" fw={700} mb={-5}>Price</Text>
            <Text fw={800} fz="xl" c="blue.7">
              ${price.toFixed(2)}
            </Text>
          </Box>
          
          <Button 
            onClick={() => onBuyTicket(eventId)}
            radius="xl"
            size="md"
            className="buy-button"
            sx={(theme) => ({
              background: 'linear-gradient(135deg, #4263eb 0%, #3b82f6 100%)',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease',
              fontWeight: 600,
              letterSpacing: '0.5px',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b5bdb 0%, #2b6cb0 100%)',
              }
            })}
          >
            Buy Tickets
          </Button>
        </Group>
      </Box>
    </Paper>
  );
}

export default EventCard;