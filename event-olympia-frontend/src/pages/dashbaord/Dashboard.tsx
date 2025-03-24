import React, { useState, useEffect } from 'react';
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
  Paper,
  Loader,
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
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Stat({ title, value, diff, icon: Icon, color }) {
  const theme = useMantineTheme();
  const diffColor = diff > 0 ? theme.colors.teal[6] : theme.colors.red[6];
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group position="apart" mb="xs">
        <Text size="sm" fw={500} c="dimmed">
          {title}
        </Text>
        <Icon size={28} stroke={1.5} color={theme.colors[color][6]} />
      </Group>
      <Text size="2xl" fw={700}>
        {value}
      </Text>
      <Group spacing={5} mt="md">
        {diff > 0 ? (
          <IconArrowUpRight size={16} color={diffColor} />
        ) : (
          <IconArrowDownRight size={16} color={diffColor} />
        )}
        <Text size="sm" c={diffColor} fw={500}>
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Total Events', value: '0', diff: 0, icon: IconCalendarEvent, color: 'blue' },
    { title: 'Total Users', value: '0', diff: 0, icon: IconUsers, color: 'green' },
    { title: 'Total Revenue', value: '$0', diff: 0, icon: IconChartPie, color: 'violet' },
    { title: 'Total Tickets', value: '0', diff: 0, icon: IconTicket, color: 'orange' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [eventsStatsRes, userStatsRes, ticketsStatsRes, eventsRes] = await Promise.all([
          axios.get('/api/event/statistics'),
          axios.get('/api/users/statistics'),
          axios.get('/api/tickets/statistics'),
          axios.get('/api/event?limit=5')
        ]);

        console.log('User Statistics Response:', userStatsRes.data);

        setEvents(
          eventsRes.data.map((event) => ({
            id: event._id,
            title: event.title,
            date: new Date(event.date).toISOString().split('T')[0],
            attendees: event.attendees || 0,
            status: event.status || 'planning',
            progress: calculateEventProgress(event),
          }))
        );

        setStats([
          {
            title: 'Total Events',
            value: eventsStatsRes.data.totalEvents.toString(),
            diff: 0,
            icon: IconCalendarEvent,
            color: 'blue',
          },
          {
            title: 'Total Users',
            value: userStatsRes.data.totalUsers.toString(),
            diff: 0,
            icon: IconUsers,
            color: 'green',
          },
          {
            title: 'Total Revenue',
            value: `$${ticketsStatsRes.data.totalRevenue.toLocaleString()}`,
            diff: 0,
            icon: IconChartPie,
            color: 'violet',
          },
          {
            title: 'Total Tickets',
            value: ticketsStatsRes.data.totalTickets.toString(),
            diff: 0,
            icon: IconTicket,
            color: 'orange',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const calculateEventProgress = (event) => {
    if (event.status === 'completed') return 100;
    
    const now = new Date();
    const eventDate = new Date(event.date);
    const createdDate = event.createdAt ? new Date(event.createdAt) : new Date(now.getTime() - 1000*60*60*24*30);
    
    if (eventDate < now) return 95;
    
    const totalTimespan = eventDate - createdDate;
    const elapsed = now - createdDate;
    
    return Math.min(95, Math.max(5, Math.floor((elapsed / totalTimespan) * 100)));
  };

  return (
    <Box p="md">
      <Stack gap="xl">
        <Group position="apart" align="flex-end">
          <Box>
            <Text c="dimmed" size="sm">Welcome back</Text>
            <Title order={2} mb="xs">Dashboard Overview</Title>
          </Box>
        </Group>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader size="lg" />
          </Box>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              {stats.map((stat) => (
                <Stat key={stat.title} {...stat} />
              ))}
            </SimpleGrid>

            <Paper p="md" shadow="sm" radius="md" withBorder>
              <Group position="apart" mb="lg">
                <Title order={3}>Upcoming Events</Title>
                <Button 
                  variant="light" 
                  radius="md" 
                  onClick={() => navigate('/admin/events')}
                >
                  View All Events
                </Button>
              </Group>

              <Box style={{ overflowX: 'auto' }}>
                {events.length > 0 ? (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Event Name</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Attendees</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Completion</Table.Th>
                        <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {events.map((event) => (
                        <Table.Tr key={event.id}>
                          <Table.Td fw={500}>{event.title}</Table.Td>
                          <Table.Td>{event.date}</Table.Td>
                          <Table.Td>{event.attendees.toLocaleString()}</Table.Td>
                          <Table.Td>
                            <Badge 
                              variant="light"
                              color={
                                event.status === 'active' ? 'green' : 
                                event.status === 'planning' ? 'blue' : 'gray'
                              }
                            >
                              {event.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td style={{ width: '15%' }}>
                            <Stack gap={5}>
                              <Progress
                                value={event.progress}
                                color={
                                  event.progress >= 90 ? 'green' : 
                                  event.progress >= 50 ? 'blue' : 'orange'
                                }
                                size="sm"
                                radius="xl"
                              />
                              <Text size="xs" ta="right" c="dimmed">
                                {event.progress}%
                              </Text>
                            </Stack>
                          </Table.Td>
                          <Table.Td>
                            <Group spacing={5} position="center">
                              <ActionIcon 
                                variant="subtle" 
                                color="blue" 
                                onClick={() => navigate(`/admin/events/${event.id}`)}
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                              <ActionIcon 
                                variant="subtle" 
                                color="violet" 
                                onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                              <ActionIcon 
                                variant="subtle" 
                                color="red"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this event?')) {
                                    // Delete event logic here
                                  }
                                }}
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                ) : (
                  <Text ta="center" py="lg" c="dimmed">No events found</Text>
                )}
              </Box>
            </Paper>
          </>
        )}
      </Stack>
    </Box>
  );
}