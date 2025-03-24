import { TextInput, Button, Paper, Title, Text, Stack, Alert, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';

export function ForgotPassword() {
    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: async (values: { email: string }) => {
            try {
                const response = await api.post('/auth/forgot-password', values);
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    throw new Error('No account found with this email address.');
                } else if (error.response?.status === 500) {
                    throw new Error('Failed to send reset email. Please try again later or contact support.');
                }
                throw error;
            }
        },
        onSuccess: () => {
            alert('Password reset instructions have been sent to your email. Please check your inbox.');
        },
        onError: (error: any) => {
            console.error('Forgot password error:', error);
            alert(error.message || 'Failed to process request. Please try again.');
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        forgotPasswordMutation.mutate(values);
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
                <Title ta="center" order={2}>Forgot Password</Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Enter your email to receive password reset instructions
                </Text>

                {forgotPasswordMutation.isError && (
                    <Alert color="red" mt="md">
                        {forgotPasswordMutation.error.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack mt="xl">
                        <TextInput
                            label="Email"
                            placeholder="hello@example.com"
                            radius="md"
                            required
                            disabled={forgotPasswordMutation.isPending}
                            {...form.getInputProps('email')}
                        />
                        <Button
                            type="submit"
                            radius="md"
                            loading={forgotPasswordMutation.isPending}
                            fullWidth
                        >
                            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Instructions'}
                        </Button>
                        <Text ta="center" size="sm">
                            Remember your password?{' '}
                            <Link to="/login" style={{ color: '#228be6' }}>
                                Login
                            </Link>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Center>
    );
} 