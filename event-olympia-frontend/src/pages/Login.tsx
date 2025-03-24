import { TextInput, PasswordInput, Button, Paper, Title, Text, Stack, Anchor, Center, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser, setUserRole } = useAuth();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (values: { email: string; password: string }) => {
            try {
                const response = await api.post('/auth/login', values);
                return response.data;
            } catch (error: any) {
                console.error("API Error:", error.response?.data || error);
                throw new Error(error.response?.data?.message || 'Login failed');
            }
        },
        onSuccess: (data) => {
            console.log("Login response:", data);

            if (!data.access_token) {
                throw new Error('No access token provided');
            }

            const { access_token, role, user_id } = data;

            const user = {
                _id: user_id, 
                email: form.values.email,
                name: form.values.email.split('@')[0] || 'User',
                role: role || 'user',
            };

            console.log("Processed user data:", user);

            localStorage.setItem('token', access_token);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('userRole', role);
            localStorage.setItem('user', JSON.stringify(user));

            setIsAuthenticated(true);
            setUserRole(role);
            setUser(user);

            console.log("Auth state updated, navigating...");

            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        },
        onError: (error: Error) => {
            console.error("Login error:", error);
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        loginMutation.mutate(values);
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
            >
                <Title ta="center" order={2}>Welcome back!</Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Don't have an account?{' '}
                    <Anchor component={Link} to="/register" size="sm">
                        Create account
                    </Anchor>
                </Text>

                {loginMutation.isError && (
                    <Alert color="red" mt="md">
                        {loginMutation.error.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack mt="xl">
                        <TextInput
                            label="Email"
                            placeholder="hello@example.com"
                            radius="md"
                            required
                            disabled={loginMutation.isPending}
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            radius="md"
                            required
                            disabled={loginMutation.isPending}
                            {...form.getInputProps('password')}
                        />
                        <Anchor component={Link} to="/forgot-password" size="sm" ta="right">
                            Forgot password?
                        </Anchor>
                        <Button
                            type="submit"
                            radius="md"
                            loading={loginMutation.isPending}
                            fullWidth
                        >
                            {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    );
}