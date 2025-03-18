import React from 'react';
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
  IconPlus,
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

  return (
    <Box p="md">
      <Stack gap="xl">
        <Group position="apart" align="flex-end">
          <Box>
            <Text c="dimmed" size="sm">Welcome back</Text>
            <Title order={2} mb="xs">Dashboard Overview</Title>
          </Box>
        
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {statsData.map((stat) => (
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
                {mockEvents.map((event) => (
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
                        <ActionIcon variant="subtle" color="red">
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}