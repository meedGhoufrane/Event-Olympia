import { TextInput, PasswordInput, Button, Paper, Title, Text, Stack, Alert, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
            confirmPassword: (value, values) => 
                value !== values.password ? 'Passwords do not match' : null,
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async (values: { password: string }) => {
            try {
                const response = await api.post(`/auth/reset-password/${token}`, {
                    password: values.password,
                });
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    throw new Error('Invalid or expired reset link. Please request a new one.');
                }
                throw error;
            }
        },
        onSuccess: () => {
            alert('Password has been reset successfully. Please login with your new password.');
            navigate('/login');
        },
        onError: (error: any) => {
            console.error('Reset password error:', error);
            alert(error.message || 'Failed to reset password. Please try again.');
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        resetPasswordMutation.mutate({ password: values.password });
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
                <Title ta="center" order={2}>Reset Password</Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Enter your new password below
                </Text>

                {resetPasswordMutation.isError && (
                    <Alert color="red" mt="md">
                        {resetPasswordMutation.error.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack mt="xl">
                        <PasswordInput
                            label="New Password"
                            placeholder="Enter your new password"
                            radius="md"
                            required
                            disabled={resetPasswordMutation.isPending}
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            radius="md"
                            required
                            disabled={resetPasswordMutation.isPending}
                            {...form.getInputProps('confirmPassword')}
                        />
                        <Button
                            type="submit"
                            radius="md"
                            loading={resetPasswordMutation.isPending}
                            fullWidth
                        >
                            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
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