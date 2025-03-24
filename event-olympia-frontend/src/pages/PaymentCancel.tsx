import { Container, Title, Text, Button, ThemeIcon, Paper, Center } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Container size="sm" py={50}>
      <Paper shadow="md" radius="lg" p={30} withBorder>
        <Center>
          <div style={{ textAlign: 'center' }}>
            <ThemeIcon color="red" size={80} radius={40} style={{ margin: '0 auto 20px' }}>
              <IconX size={50} />
            </ThemeIcon>
            
            <Title order={1} ta="center">Payment Cancelled</Title>
            
            <Text size="lg" ta="center" mt={10} mb={20}>
              Your payment was cancelled and no charges were made to your account.
            </Text>
            
            <Text c="dimmed" ta="center" mb={30}>
              You can try again whenever you're ready or browse other events.
            </Text>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button 
                variant="filled"
                size="lg" 
                onClick={() => navigate(-1)}
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/events')}
              >
                Browse Events
              </Button>
            </div>
          </div>
        </Center>
      </Paper>
    </Container>
  );
} 