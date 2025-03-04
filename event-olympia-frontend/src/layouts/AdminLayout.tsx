import { AppShell, Group, Text, Title, Stack, Button, useMantineTheme } from '@mantine/core';
import { IconLogout, IconDashboard, IconUsers, IconCalendarEvent, IconTicket, IconChartPie } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: false },
      }}
      header={{
        height: 60,
      }}
    >
      <AppShell.Header p="md">
        <Group justify="space-between" style={{ height: '100%' }}>
          <Title order={3}>Admin Panel</Title>
          <Text>Welcome, Admin!</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Stack gap="sm">
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
            <CustomNavbar
              icon={IconChartPie}
              label="Statistics"
              active={location.pathname === '/admin/statistics'}
              onClick={() => navigate('/admin/statistics')}
            />
          </Stack>
        </AppShell.Section>
        <AppShell.Section>
          <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}