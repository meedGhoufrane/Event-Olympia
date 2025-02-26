import { TextInput, PasswordInput, Button, Paper, Title, Text, Stack, Anchor, Center, Group, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Register() {
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'user', // Set default role here
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (values: { email: string; password: string; firstName: string; lastName: string }) => {
            try {
                const response = await api.post('/auth/register', values);
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Registration failed');
            }
        },
        onSuccess: () => {
            navigate('/login');
        },
    });

    return (
        <Center mih="70vh">
            <Paper
                shadow="xl"
                radius="md"
                p="xl"
                w={400}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                }}
            >        <Title ta="center" order={2}>Create an account</Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Already have an account?{' '}
                    <Anchor component={Link} to="/login" size="sm">
                        Login
                    </Anchor>
                </Text>

                {registerMutation.isError && (
                    <Alert color="red" mt="md">
                        {registerMutation.error.message}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit((values) => registerMutation.mutate(values))}>
                    <Stack mt="xl">
                        <TextInput
                            label="Email"
                            placeholder="hello@example.com"
                            radius="md"
                            required
                            disabled={registerMutation.isPending}
                            {...form.getInputProps('email')}
                        />
                        <Group grow>
                            <TextInput
                                label="First Name"
                                placeholder="John"
                                radius="md"
                                disabled={registerMutation.isPending}
                                {...form.getInputProps('firstName')}
                            />
                            <TextInput
                                label="Last Name"
                                placeholder="Doe"
                                radius="md"
                                disabled={registerMutation.isPending}
                                {...form.getInputProps('lastName')}
                            />
                        </Group>
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            radius="md"
                            required
                            disabled={registerMutation.isPending}
                            {...form.getInputProps('password')}
                        />
                        <Button
                            type="submit"
                            radius="md"
                            loading={registerMutation.isPending}
                            fullWidth
                        >
                            {registerMutation.isPending ? 'Creating account...' : 'Register'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    );
}