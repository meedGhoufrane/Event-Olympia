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
    Paper
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load users. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
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
                await api.delete(`/users/${id}`);
                setUsers(users.filter((user) => user._id !== id));
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
            }
        }
    };

    const handleOpenEditModal = (user) => {
        setCurrentUser(user);
        setEditModalOpened(true);
    };

    const handleUpdateUser = async () => {
        try {
            const response = await api.patch(`/users/${currentUser._id}`, currentUser);
            setUsers(users.map(user => user._id === currentUser._id ? response.data : user));
            setEditModalOpened(false);
            Swal.fire('Updated!', 'User has been successfully updated.', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire('Error!', 'An error occurred when updating the user', 'error');
        }
    };

    return (
        <Container size="lg" py="xl">
            <Stack>
                <Group position="apart" mb="md">
                    <Title order={2}>Manage Users</Title>
                </Group>
                
                <Paper withBorder p="md" radius="md" shadow="sm">
                    <Table highlightOnHover withBorder withColumnBorders>
                        <thead style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>First Name</th>
                                <th style={{ padding: '12px' }}>Last Name</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Role</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px' }}>{user.firstName}</td>
                                    <td style={{ padding: '12px' }}>{user.lastName}</td>
                                    <td style={{ padding: '12px' }}>{user.email}</td>
                                    <td style={{ padding: '12px' }}>{user.role}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <Group spacing="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() => handleOpenEditModal(user)}
                                            >
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => handleDelete(user._id)}
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

            {/* Modal for editing users */}
            <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Edit User">
                <TextInput label="First Name" value={currentUser.firstName} onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.currentTarget.value })} mb="md" />
                <TextInput label="Last Name" value={currentUser.lastName} onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.currentTarget.value })} mb="md" />
                <TextInput label="Email" value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.currentTarget.value })} mb="md" />
                <TextInput label="Role" value={currentUser.role} onChange={(e) => setCurrentUser({ ...currentUser, role: e.currentTarget.value })} mb="md" />
                <Button fullWidth onClick={handleUpdateUser}>Update User</Button>
            </Modal>
        </Container>
    );
};

export default ManageUsers;