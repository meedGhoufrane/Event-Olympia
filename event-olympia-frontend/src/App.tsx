import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme, Container, Title, Text, Button, Group, Stack, rem } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import '@mantine/core/styles.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  colors: {
    blue: [
      '#E7F5FF',
      '#D0EBFF',
      '#A5D8FF',
      '#74C0FC',
      '#4DABF7',
      '#339AF0',
      '#228BE6',
      '#1C7ED6',
      '#1971C2',
      '#1864AB',
    ],
  },
});

function HomePage() {
  return (
    <Container size="lg" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <Stack align="center" spacing={rem(50)} style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: rem(800), width: '100%' }}>
          <Title
            order={1}
            size={rem(60)}
            fw={800}
            lh={1.1}
            mb={rem(30)}
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            variant="gradient"
          >
            Your Ultimate Event Management Platform
          </Title>
          <Text size="xl" c="dimmed" maw={rem(600)} mx="auto" mb={rem(40)}>
            Create, manage, and discover amazing events. Join our community of event organizers and attendees.
          </Text>
          <Group justify="center">
            <Button
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Get Started
            </Button>
            <Button
              size="xl"
              radius="md"
              variant="outline"
              color="blue"
            >
              Learn More
            </Button>
          </Group>
        </div>

        <Container size="lg" style={{ width: '100%' }}>
          <Group grow align="stretch">
            {[
              {
                title: 'Create Events',
                description: 'Easily create and manage your events with our intuitive tools.',
              },
              {
                title: 'Sell Tickets',
                description: 'Set up ticket sales and track your event revenue effortlessly.',
              },
              {
                title: 'Engage Community',
                description: 'Connect with attendees and build your event community.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{
                  padding: rem(24),
                  borderRadius: 'var(--mantine-radius-md)',
                  backgroundColor: 'var(--mantine-color-blue-0)',
                }}
              >
                <Title order={3} mb={rem(12)}>{feature.title}</Title>
                <Text c="dimmed">{feature.description}</Text>
              </div>
            ))}
          </Group>
        </Container>
      </Stack>
    </Container>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<ProtectedRoute type="guest"><Login /></ProtectedRoute>} />
                <Route path="register" element={<ProtectedRoute type="guest"><Register /></ProtectedRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;