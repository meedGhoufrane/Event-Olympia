import React, { useEffect, useState } from 'react';
import {
    Title,
    Stack,
    Table,
    Button,
    ActionIcon,
    Group,
    Container,
    Modal,
    TextInput,
    Paper,
    Select
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ManageTickets: React.FC = () => {
    const [tickets, setTickets] = useState([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [newTicket, setNewTicket] = useState({
        eventId: '',
        userId: '',
        price: 0,
        status: 'available',
    });
    const [currentTicket, setCurrentTicket] = useState({
        _id: '',
        eventId: '',
        userId: '',
        price: 0,
        status: 'available',
    });
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await api.get('/tickets');
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error.response ? error.response.data : error.message);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load tickets. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }

        async function fetchEvents() {
            try {
                const response = await api.get('/event');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        }

        async function fetchUsers() {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchTickets();
        fetchEvents();
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/tickets/${id}`);
                setTickets(tickets.filter((ticket) => ticket._id !== id));
                Swal.fire('Deleted!', 'Your ticket has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting ticket:', error);
                Swal.fire('Error!', 'There was a problem deleting the ticket.', 'error');
            }
        }
    };

    const handleOpenEditModal = (ticket) => {
        setCurrentTicket(ticket);
        setEditModalOpened(true);
    };

    const handleUpdateTicket = async () => {
        try {
            const response = await api.patch(`/tickets/${currentTicket._id}`, currentTicket);
            setTickets(tickets.map(ticket => ticket._id === currentTicket._id ? response.data : ticket));
            setEditModalOpened(false);
            Swal.fire('Updated!', 'Ticket has been successfully updated.', 'success');
        } catch (error) {
            console.error('Error updating ticket:', error);
            Swal.fire('Error!', 'An error occurred when updating the ticket', 'error');
        }
    };

    return (
        <Container size="lg" py="xl">
            <Stack>
                <Group position="apart" mb="md">
                    <Title order={2}>Manage Tickets</Title>
                </Group>
                
                <Paper withBorder p="md" radius="md" shadow="sm">
                    <Table highlightOnHover withBorder withColumnBorders>
                        <thead style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Event Name</th>
                                <th style={{ padding: '12px' }}>User First Name</th>
                                <th style={{ padding: '12px' }}>Price</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px' }}>{ticket.event ? ticket.event.name : 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>{ticket.user ? ticket.user.firstName : 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>${ticket.price.toFixed(2)}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <Group spacing="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() => handleOpenEditModal(ticket)}
                                            >
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => handleDelete(ticket._id)}
                                            >
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </Group>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Paper>
            </Stack>

            

            {/* Modal for editing tickets */}
            <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Edit Ticket">
                <Select
                    label="Event"
                    placeholder="Select an event"
                    data={events.map(event => ({ value: event._id, label: event.name }))}
                    value={currentTicket.eventId}
                    onChange={(value) => setCurrentTicket({ ...currentTicket, eventId: value })}
                    mb="md"
                />
                <Select
                    label="User"
                    placeholder="Select a user"
                    data={users.map(user => ({ value: user._id, label: user.firstName }))}
                    value={currentTicket.userId}
                    onChange={(value) => setCurrentTicket({ ...currentTicket, userId: value })}
                    mb="md"
                />
                <TextInput label="Price" type="number" value={currentTicket.price} onChange={(e) => setCurrentTicket({ ...currentTicket, price: Number(e.currentTarget.value) })} mb="md" />
                <Button fullWidth onClick={handleUpdateTicket}>Update Ticket</Button>
            </Modal>
        </Container>
    );
};

export default ManageTickets;
