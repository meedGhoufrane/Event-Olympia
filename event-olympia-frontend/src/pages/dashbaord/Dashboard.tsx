// src/pages/dashboard/Dashboard.tsx
import React, { useState } from 'react';
import {
  Text,
  Title,
  Stack,
  Button,
  SimpleGrid,
  Badge,
  Table,
  ActionIcon,
  Progress,
  Card,
  Group,
  useMantineTheme,
  Box,
  AppShell,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconUsers,
  IconTicket,
  IconChartPie,
  IconArrowUpRight,
  IconArrowDownRight,
  IconEye,
  IconEdit,
  IconTrash,
  IconDashboard,
  IconUserCircle,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const mockEvents = [
  { id: 1, title: 'Tech Conference 2025', attendees: 450, status: 'active', date: '2025-03-15', progress: 85 },
  { id: 2, title: 'Music Festival', attendees: 1200, status: 'planning', date: '2025-04-22', progress: 45 },
  { id: 3, title: 'Startup Meetup', attendees: 120, status: 'active', date: '2025-03-05', progress: 95 },
  { id: 4, title: 'Design Workshop', attendees: 75, status: 'completed', date: '2025-02-20', progress: 100 },
];

const statsData = [
  { title: 'Total Events', value: '24', diff: 12, icon: IconCalendarEvent, color: 'blue' },
  { title: 'Active Users', value: '1,482', diff: 5.5, icon: IconUsers, color: 'green' },
  { title: 'Total Revenue', value: '$48,920', diff: -3.2, icon: IconChartPie, color: 'violet' },
  { title: 'Pending Requests', value: '9', diff: 8.1, icon: IconTicket, color: 'orange' },
];

const navItems = [
  { icon: IconDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: IconUsers, label: 'Manage Users', path: '/admin/users' },
  { icon: IconCalendarEvent, label: 'Manage Events', path: '/admin/events' },
  { icon: IconTicket, label: 'Manage Tickets', path: '/admin/tickets' },
  { icon: IconChartPie, label: 'Statistics', path: '/admin/statistics' },
  { icon: IconUserCircle, label: 'Profile', path: '/profile' },
  { icon: IconSettings, label: 'Settings', path: '/settings' },
  { icon: IconLogout, label: 'Logout', path: '/logout' },
];

function Stat({ title, value, diff, icon: Icon, color }) {
  const theme = useMantineTheme();
  return (
    <Card p="md" style={{ backgroundColor: theme.colors[color][0] }}>
      <Group position="apart">
        <Text size="sm" c="dimmed">
          {title}
        </Text>
        <Icon size={24} color={theme.colors[color][6]} />
      </Group>
      <Text size="xl" fw={700} mt={theme.spacing.sm}>
        {value}
      </Text>
      <Group align="center">
        <Text size="sm" c={diff > 0 ? 'teal' : 'red'} fw={500}>
          {diff > 0 ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
          {Math.abs(diff)}%
        </Text>
        <Text size="xs" c="dimmed">
          compared to previous month
        </Text>
      </Group>
    </Card>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [activeItem, setActiveItem] = useState('/admin/dashboard');

  const handleNavClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 250,
        breakpoint: 'sm'
      }}
    >
      {/* <AppShell.Navbar p="md">
        <Stack spacing="xs">
          <Title order={3} mb="md">Event Management</Title>

          {navItems.map((item) => (
            <CustomNavbar
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.path}
              onClick={() => handleNavClick(item.path)}
            />
          ))}

          <Box mt="auto" pt="xl">
            <Text size="xs" c="dimmed" ta="center">
              © 2025 Event Management System
            </Text>
          </Box>
        </Stack>
      </AppShell.Navbar> */}

      <AppShell.Main>
        <Stack gap="md">
          <Title order={1}>Dashboard</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
            {statsData.map((stat) => (
              <Stat key={stat.title} {...stat} />
            ))}
          </SimpleGrid>
          <Group justify="space-between">
            <Title order={2}>Events</Title>
            <Button variant="outline" onClick={() => navigate('/admin/events')}>
              View All Events
            </Button>
          </Group>
          <Box style={{ overflowX: 'auto' }}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Event</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Attendees</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Progress</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockEvents.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>{event.title}</Table.Td>
                    <Table.Td>{event.date}</Table.Td>
                    <Table.Td>{event.attendees.toLocaleString()}</Table.Td>
                    <Table.Td>
                      <Badge color={event.status === 'active' ? 'green' : event.status === 'planning' ? 'blue' : 'gray'}>
                        {event.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Progress
                        value={event.progress}
                        color={event.progress >= 90 ? 'green' : event.progress >= 50 ? 'blue' : 'orange'}
                        size="sm"
                        radius="xl"
                        style={{ width: '80%' }}
                      />
                      <Text size="sm" ta="center">
                        {event.progress}%
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <ActionIcon onClick={() => navigate(`/admin/events/${event.id}`)}>
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}