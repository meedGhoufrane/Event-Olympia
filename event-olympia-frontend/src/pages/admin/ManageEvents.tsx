import React, { useEffect, useState } from 'react';
import {
    Title,
    Text,
    Stack,
    Table,
    Button,
    ActionIcon,
    Group,
    Badge,
    Image,
    Paper,
    Container,
    Modal,
    TextInput,

} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ManageEvents: React.FC = () => {
    const [events, setEvents] = useState([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        date: new Date(),
        location: '',
        image: null,
        attendees: 0,
        status: 'planning',
    });
    const [currentEvent, setCurrentEvent] = useState({
        _id: '',
        name: '',
        description: '',
        date: new Date(),
        location: '',
        image: null,
        currentImage: '',
        attendees: 0,
        status: 'planning',
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await api.get('/event');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load events. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }

        fetchEvents();
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
                await api.delete(`/event/${id}`);
                setEvents(events.filter((event) => event._id !== id));
                Swal.fire(
                    'Deleted!',
                    'Your event has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting event:', error);
                Swal.fire(
                    'Error!',
                    'There was a problem deleting the event.',
                    'error'
                );
            }
        }
    };

    const handleCreateEvent = async () => {

        if (!newEvent.name || !newEvent.description || !newEvent.date || !newEvent.location || !newEvent.image) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in all required fields.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', newEvent.name);
        formData.append('description', newEvent.description);
        formData.append('date', newEvent.date.toISOString());
        formData.append('location', newEvent.location);
        formData.append('attendees', newEvent.attendees.toString());
        formData.append('status', newEvent.status);

        formData.append('createdBy', '65dfab8d76c7f83f5cae24de');

        if (newEvent.image) {
            formData.append('image', newEvent.image);
        }

        try {
            const response = await api.post('/event', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setEvents([...events, response.data]);
            setModalOpened(false);
            setNewEvent({
                name: '',
                description: '',
                date: new Date(),
                location: '',
                image: null,
                attendees: 0,
                status: 'planning',
            });


            Swal.fire({
                title: 'Success!',
                text: 'Event created successfully!',
                icon: 'success',
                confirmButtonText: 'Great!'
            });
        } catch (error) {
            console.error('Error creating event:', error);

            if (error.response && error.response.data) {
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to create event: ${error.response.data.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred when creating the event',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };


    const handleOpenEditModal = (event) => {
        setCurrentEvent({
            _id: event._id,
            name: event.name,
            description: event.description,
            date: new Date(event.date),
            location: event.location,
            image: null,
            currentImage: event.image,
            attendees: event.attendees || 0,
            status: event.status
        });
        setEditModalOpened(true);
    };


    const handleUpdateEvent = async () => {
        if (!currentEvent.name || !currentEvent.description || !currentEvent.date || !currentEvent.location) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in all required fields.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', currentEvent.name);
        formData.append('description', currentEvent.description);
        formData.append('date', currentEvent.date.toISOString());
        formData.append('location', currentEvent.location);
        formData.append('attendees', currentEvent.attendees.toString());
        formData.append('status', currentEvent.status);

        if (currentEvent.image) {
            formData.append('image', currentEvent.image);
        }

        try {
            const response = await api.patch(`/event/${currentEvent._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setEvents(events.map(event =>
                event._id === currentEvent._id ? response.data : event
            ));

            setEditModalOpened(false);

            Swal.fire({
                title: 'Updated!',
                text: 'Event has been successfully updated.',
                icon: 'success',
                confirmButtonText: 'Great!'
            });
        } catch (error) {
            console.error('Error updating event:', error);
            if (error.response && error.response.data) {
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to update event: ${error.response.data.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred when updating the event',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    return (
        <Container size="lg" py="xl">
            <Stack>
                <Group justify="space-between" align="center">
                    <Title order={1}>Manage Events</Title>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setModalOpened(true)}
                    >
                        Create New Event
                    </Button>
                </Group>

                <Paper withBorder p="md" radius="md" shadow="sm">
                    <Table striped highlightOnHover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Image</th>
                                <th>Attendees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td>{event.name}</td>
                                    <td>
                                        <Text lineClamp={2} style={{ maxWidth: '200px' }}>
                                            {event.description}
                                        </Text>
                                    </td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>{event.location}</td>
                                    <td>
                                        {/* Display the event image or a default image if not available */}
                                        <Image
                                            src={event.image ? `/uploads/${event.image}` : 'path/to/default-image.jpg'} // Ensure the correct path
                                            alt={event.name}
                                            width={50}
                                            height={50}
                                            radius="sm"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{event.attendees}</td>
                                    <td>
                                        <Badge
                                            color={
                                                event.status === 'active'
                                                    ? 'green'
                                                    : event.status === 'planning'
                                                        ? 'blue'
                                                        : 'gray'
                                            }
                                        >
                                            {event.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Group gap="sm">
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => handleOpenEditModal(event)}
                                            >
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() => handleDelete(event._id)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Paper>

                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    title="Create New Event"
                >
                    <TextInput
                        label="Event Name"
                        value={newEvent.name}
                        onChange={(event) => setNewEvent({ ...newEvent, name: event.currentTarget.value })}
                    />
                    <TextInput
                        label="Description"
                        value={newEvent.description}
                        onChange={(event) => setNewEvent({ ...newEvent, description: event.currentTarget.value })}
                    />
                    <TextInput
                        label="Date"
                        type="date"
                        value={newEvent.date.toISOString().split('T')[0]}
                        onChange={(event) => setNewEvent({ ...newEvent, date: new Date(event.currentTarget.value) })}
                    />
                    <TextInput
                        label="Location"
                        value={newEvent.location}
                        onChange={(event) => setNewEvent({ ...newEvent, location: event.currentTarget.value })}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            if (event.currentTarget.files) {
                                setNewEvent({ ...newEvent, image: event.currentTarget.files[0] });
                            }
                        }}
                    />
                    <TextInput
                        label="Attendees"
                        type="number"
                        value={newEvent.attendees}
                        onChange={(event) => setNewEvent({ ...newEvent, attendees: Number(event.currentTarget.value) })}
                    />
                    <Button onClick={handleCreateEvent} style={{ marginTop: 15 }}>Create Event</Button>
                </Modal>

                <Modal
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    title="Edit Event"
                >
                    <TextInput
                        label="Event Name"
                        value={currentEvent.name}
                        onChange={(event) => setCurrentEvent({ ...currentEvent, name: event.currentTarget.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <TextInput
                        label="Description"
                        value={currentEvent.description}
                        onChange={(event) => setCurrentEvent({ ...currentEvent, description: event.currentTarget.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <TextInput
                        label="Date"
                        type="date"
                        value={currentEvent.date.toISOString().split('T')[0]} // Format date for input
                        onChange={(event) => setCurrentEvent({ ...currentEvent, date: new Date(event.currentTarget.value) })}
                        style={{ marginBottom: 10 }}
                    />
                    <TextInput
                        label="Location"
                        value={currentEvent.location}
                        onChange={(event) => setCurrentEvent({ ...currentEvent, location: event.currentTarget.value })}
                        style={{ marginBottom: 10 }}
                    />

                    {currentEvent.currentImage && (
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <Text size="sm">Current Image:</Text>
                            <Image
                                src={currentEvent.currentImage}
                                alt="Current event image"
                                width={100}
                                height={100}
                                radius="sm"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <div style={{ marginTop: 15, marginBottom: 15 }}>
                        <Text size="sm">Upload New Image (optional):</Text>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                if (event.currentTarget.files) {
                                    setCurrentEvent({ ...currentEvent, image: event.currentTarget.files[0] });
                                }
                            }}
                        />
                    </div>

                    <TextInput
                        label="Attendees"
                        type="number"
                        value={currentEvent.attendees}
                        onChange={(event) => setCurrentEvent({ ...currentEvent, attendees: Number(event.currentTarget.value) })}
                        style={{ marginBottom: 10 }}
                    />

                    <div style={{ marginTop: 15, marginBottom: 15 }}>
                        <Text size="sm">Status:</Text>
                        <select
                            value={currentEvent.status}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <Button onClick={handleUpdateEvent} style={{ marginTop: 15 }}>Update Event</Button>
                </Modal>
            </Stack>
        </Container>
    );
};

export default ManageEvents;