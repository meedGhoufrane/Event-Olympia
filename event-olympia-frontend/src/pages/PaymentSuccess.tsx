import { Container, Title, Text, Button, ThemeIcon, Paper, Center } from '@mantine/core';
import { IconCheck, IconTicket } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Container size="sm" py={50}>
      <Paper shadow="md" radius="lg" p={30} withBorder>
        <Center>
          <div style={{ textAlign: 'center' }}>
            <ThemeIcon color="green" size={80} radius={40} style={{ margin: '0 auto 20px' }}>
              <IconCheck size={50} />
            </ThemeIcon>
            
            <Title order={1} ta="center">Payment Successful!</Title>
            
            <Text size="lg" ta="center" mb={10}>
              Your payment has been processed successfully and your ticket has been confirmed.
            </Text>
            
            <Text c="dimmed" ta="center">
              You can view and download your tickets in your profile.
            </Text>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button 
                size="lg" 
                onClick={() => navigate('/profile/tickets')}
                leftSection={<IconTicket size={16} />}
              >
                View My Tickets
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/events')}
              >
                Browse More Events
              </Button>
            </div>
          </div>
        </Center>
      </Paper>
    </Container>
  );
} 