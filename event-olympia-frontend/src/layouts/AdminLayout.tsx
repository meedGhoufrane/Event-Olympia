import { AppShell, Group, Text, Title, Stack, Button, useMantineTheme, Box } from '@mantine/core';
import { IconLogout, IconDashboard, IconUsers, IconCalendarEvent, IconTicket, IconChartPie } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: true },
      }}
      header={{
        height: 70,
      }}
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
    >
      <AppShell.Header p="md" style={{ 
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        backgroundColor: theme.white,
      }}>
        <Group justify="space-between" style={{ height: '100%' }}>
          <Group>
            <Title order={3} c={theme.primaryColor}>Event Admin</Title>
          </Group>
          <Group>
            <Text fw={500}>Welcome, Admin!</Text>
            <Button 
              variant="subtle" 
              color="red" 
              size="sm"
              leftSection={<IconLogout size={16} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{
        borderRight: `1px solid ${theme.colors.gray[2]}`,
        backgroundColor: theme.white,
      }}>
        <AppShell.Section grow mt="md">
          <Stack gap="xs">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md">Main Navigation</Text>
            
            <CustomNavbar
              icon={IconDashboard}
              label="Dashboard"
              active={location.pathname === '/admin/dashboard'}
              onClick={() => navigate('/admin/dashboard')}
            />
            <CustomNavbar
              icon={IconUsers}
              label="Manage Users"
              active={location.pathname === '/admin/users'}
              onClick={() => navigate('/admin/users')}
            />
            <CustomNavbar
              icon={IconCalendarEvent}
              label="Manage Events"
              active={location.pathname === '/admin/events'}
              onClick={() => navigate('/admin/events')}
            />
            <CustomNavbar
              icon={IconTicket}
              label="Manage Tickets"
              active={location.pathname === '/admin/tickets'}
              onClick={() => navigate('/admin/tickets')}
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}