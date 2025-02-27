// import { useState } from 'react';
// import {
//   AppShell,
//   Group,
//   Text,
//   UnstyledButton,
//   Title,
//   ThemeIcon,
//   Stack,
//   Paper,
//   Button,
//   SimpleGrid,
//   Badge,
//   Table,
//   ActionIcon,
//   Progress,
//   Card,
//   useMantineTheme,
// } from '@mantine/core';
// import {
//   IconDashboard,
//   IconCalendarEvent,
//   IconUsers,
//   IconTicket,
//   IconChartPie,
//   IconLogout,
//   IconArrowUpRight,
//   IconArrowDownRight,
//   IconEye,
//   IconEdit,
//   IconTrash,
// } from '@tabler/icons-react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const mockEvents = [
//   { id: 1, title: 'Tech Conference 2025', attendees: 450, status: 'active', date: '2025-03-15', progress: 85 },
//   { id: 2, title: 'Music Festival', attendees: 1200, status: 'planning', date: '2025-04-22', progress: 45 },
//   { id: 3, title: 'Startup Meetup', attendees: 120, status: 'active', date: '2025-03-05', progress: 95 },
//   { id: 4, title: 'Design Workshop', attendees: 75, status: 'completed', date: '2025-02-20', progress: 100 },
// ];

// const statsData = [
//   { title: 'Total Events', value: '24', diff: 12, icon: IconCalendarEvent, color: 'blue' },
//   { title: 'Active Users', value: '1,482', diff: 5.5, icon: IconUsers, color: 'green' },
//   { title: 'Total Revenue', value: '$48,920', diff: -3.2, icon: IconChartPie, color: 'violet' },
//   { title: 'Pending Requests', value: '9', diff: 8.1, icon: IconTicket, color: 'orange' },
// ];

// function Stat({ title, value, diff, icon: Icon, color }) {
//   return (
//     <Paper withBorder p="md" radius="md">
//       <Group justify="space-between">
//         <div>
//           <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
//             {title}
//           </Text>
//           <Text fw={700} size="xl">
//             {value}
//           </Text>
//         </div>
//         <ThemeIcon color={color} variant="light" size={38} radius="md">
//           <Icon size={rem(28)} stroke={1.5} />
//         </ThemeIcon>
//       </Group>
//       <Group mt="xs">
//         <Text c={diff > 0 ? 'teal' : 'red'} size="sm" fw={500}>
//           {diff > 0 ? <IconArrowUpRight size="1rem" stroke={1.5} /> : <IconArrowDownRight size="1rem" stroke={1.5} />}
//           {Math.abs(diff)}%
//         </Text>
//         <Text c="dimmed" size="xs">
//           compared to previous month
//         </Text>
//       </Group>
//     </Paper>
//   );
// }

// const NavbarLink = ({ icon: Icon, label, active, onClick }) => {
//   return (
//     <UnstyledButton
//       onClick={onClick}
//       sx={(theme) => ({
//         display: 'block',
//         width: '100%',
//         padding: theme.spacing.xs,
//         borderRadius: theme.radius.sm,
//         color: active ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7] : theme.colors.gray[7],
//         backgroundColor: active ? theme.colors[theme.primaryColor][0] : 'transparent',
//         '&:hover': {
//           backgroundColor: theme.colors[theme.primaryColor][0],
//         },
//       })}
//     >
//       <Group>
//         <Icon size={rem(20)} />
//         <Text size="sm">{label}</Text>
//       </Group>
//     </UnstyledButton>
//   );
// };

// export function Dashboard() {
//   const [section, setSection] = useState('dashboard');
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const theme = useMantineTheme();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <AppShell
//       padding="md"
//       styles={{
//         main: {
//           background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
//         },
//       }}
//     >
//       <div style={{ paddingTop: '20px' }}>
//         <Title order={2} mb="md">
//           Dashboard Overview
//         </Title>
//         <SimpleGrid cols={4} spacing="md" mb="lg" breakpoints={[
//           { maxWidth: 'md', cols: 2 },
//           { maxWidth: 'xs', cols: 1 },
//         ]}>
//           {statsData.map((stat) => (
//             <Stat {...stat} key={stat.title} />
//           ))}
//         </SimpleGrid>

//         <Group position="apart" mb="md">
//           <Title order={3}>Upcoming Events</Title>
//           <Button variant="light">View All Events</Button>
//         </Group>

//         <Paper withBorder radius="md" p={0}>
//           <Table striped>
//             <thead>
//               <tr>
//                 <th>Event</th>
//                 <th>Date</th>
//                 <th>Attendees</th>
//                 <th>Status</th>
//                 <th>Progress</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {mockEvents.map((event) => (
//                 <tr key={event.id}>
//                   <td>
//                     <Text fw={500}>{event.title}</Text>
//                   </td>
//                   <td>{event.date}</td>
//                   <td>{event.attendees.toLocaleString()}</td>
//                   <td>
//                     <Badge 
//                       color={
//                         event.status === 'active' ? 'green' : 
//                         event.status === 'planning' ? 'blue' : 
//                         'gray'
//                       }
//                     >
//                       {event.status}
//                     </Badge>
//                   </td>
//                   <td style={{ width: '20%' }}>
//                     <Group position="apart">
//                       <Text size="xs" color="dimmed">
//                         {event.progress}%
//                       </Text>
//                       <Progress 
//                         value={event.progress} 
//                         color={
//                           event.progress >= 90 ? 'green' : 
//                           event.progress >= 50 ? 'blue' : 
//                           'orange'
//                         }
//                         size="sm" 
//                         radius="xl" 
//                         style={{ width: '80%' }} 
//                       />
//                     </Group>
//                   </td>
//                   <td>
//                     <Group spacing="xs">
//                       <ActionIcon color="blue" variant="subtle">
//                         <IconEye size="1rem" />
//                       </ActionIcon>
//                       <ActionIcon color="green" variant="subtle">
//                         <IconEdit size="1rem" />
//                       </ActionIcon>
//                       <ActionIcon color="red" variant="subtle">
//                         <IconTrash size="1rem" />
//                       </ActionIcon>
//                     </Group>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Paper>
//       </div>
//     </AppShell>
//   );
// }