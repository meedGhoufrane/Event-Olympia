import { Title, Text, Badge, Container, SimpleGrid, Paper, Box, Stack, rem } from '@mantine/core';

// SVG icons for feature cards
const CalendarIcon = ({ size = 48, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TicketIcon = ({ size = 48, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9Z"></path>
    <path d="M10 16V8"></path>
    <path d="M14 16V8"></path>
  </svg>
);

const UsersIcon = ({ size = 48, color = "#61dafb" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export function FeaturesSection() {
  return (
    <Box 
      py={rem(100)} 
      style={{
        background: 'linear-gradient(180deg, rgba(7, 15, 35, 0.98) 0%, rgba(10, 20, 45, 0.95) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Container size="lg">
        <Stack align="center" mb={rem(60)}>
          <Badge 
            size="lg" 
            radius="xl" 
            color="blue" 
            variant="filled"
            style={{
              boxShadow: '0 2px 8px rgba(37, 150, 255, 0.3)',
            }}
          >
            Why Choose Us
          </Badge>
          <Title order={2} c="white" ta="center" size={rem(42)} fw={800}>
            The Ultimate Event Management Platform
          </Title>
          <Text c="gray.4" ta="center" mt={rem(15)}>
            Everything you need to create, promote, and manage successful events in one place
          </Text>
        </Stack>
        
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={rem(30)}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <Paper
      p={rem(40)}
      radius="md"
      style={{
        backgroundColor: 'rgba(18, 30, 56, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        height: '100%',
      }}
      className="feature-card"
      withBorder
      shadow="md"
      ta="center"
    >
      <Box 
        mb={rem(20)}
        style={{ 
          transition: 'transform 0.3s',
        }}
        className="feature-icon"
      >
        {icon}
      </Box>
      <Title order={3} mb={rem(15)} c="white">{title}</Title>
      <Text c="gray.4" lh={1.7}>{description}</Text>
    </Paper>
  );
}

const features = [
  {
    title: 'Create & Manage',
    description: 'Easily create and manage your events with our powerful tools.',
    icon: <CalendarIcon size={48} />,
  },
  {
    title: 'Sell Tickets',
    description: 'Set up ticket sales and track your event revenue effortlessly.',
    icon: <TicketIcon size={48} />,
  },
  {
    title: 'Engage Community',
    description: 'Connect with attendees and build your event community.',
    icon: <UsersIcon size={48} />,
  },
];
