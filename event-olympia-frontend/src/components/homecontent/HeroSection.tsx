import { Title, Text, Button, Group, Stack, rem, Box, Container, Overlay, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';

// Simple SVG icons
const CalendarIcon = ({ size = 36, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const LocationIcon = ({ size = 36, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export function HeroSection() {
  return (
    <Box 
      pos="relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        marginTop: '-70px',
        paddingTop: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.65) 100%)"
        opacity={0.85}
        zIndex={1}
      />
      
      <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
        <Stack align="center" spacing={rem(30)}>
          <Badge 
            size="lg" 
            radius="xl" 
            color="blue" 
            variant="filled"
            style={{
              boxShadow: '0 2px 8px rgba(37, 150, 255, 0.3)',
            }}
          >
            THE PREMIER EVENT
          </Badge>
          
          <Title order={1} c="white" ta="center" size={rem(56)} fw={900} lh={1.1}>
            The Premier Conference for Event Professionals
          </Title>
          
          <Group 
            py={rem(15)} 
            px={rem(25)} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
              borderRadius: rem(12),
              gap: rem(30)
            }}
          >
            <Group gap={rem(10)}>
              <CalendarIcon size={28} />
              <Box>
                <Text size="sm" c="gray.3">DATE</Text>
                <Text size="lg" fw={700} c="white">March 15-17, 2025</Text>
              </Box>
            </Group>
            
            <Box style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.3)' }} />
            
            <Group gap={rem(10)}>
              <LocationIcon size={28} />
              <Box>
                <Text size="sm" c="gray.3">LOCATION</Text>
                <Text size="lg" fw={700} c="white">Convention Center, New York</Text>
              </Box>
            </Group>
          </Group>
          
          <Text c="gray.3" ta="center" size="xl" lh={1.7} mt={rem(10)}>
            Connect with industry leaders, discover innovative solutions, and elevate your event planning skills.
          </Text>
          
          <Group justify="center" mt={rem(20)}>
            <Button
              component={Link}
              to="/Tickets"
              size="xl"
              radius="xl"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              px={rem(50)}
              py={rem(20)}
              style={{ 
                fontWeight: 700, 
                fontSize: rem(18),
                boxShadow: '0 4px 14px rgba(0, 118, 255, 0.4)',
              }}
            >
              Buy Tickets Now
            </Button>
            
            <Button
              component={Link}
              to="/schedule"
              size="xl"
              radius="xl"
              variant="outline"
              color="gray.0"
              px={rem(50)}
              py={rem(20)}
              style={{ 
                fontWeight: 700, 
                fontSize: rem(18),
                borderWidth: 2,
              }}
            >
              View Schedule
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}