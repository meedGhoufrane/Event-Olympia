import { Link } from 'react-router-dom';
import { Group, Button, Title, Container, rem, Menu, Avatar } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Container size="md" h="100%">
      <Group h="100%" justify="space-between">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Title order={2} style={{ fontSize: rem(24) }}>Event Olympia</Title>
        </Link>
        <Group>
          {isAuthenticated ? (
            <Menu position="bottom-end">
              <Menu.Target>
                <Avatar radius="xl" size="md" color="blue" style={{ cursor: 'pointer' }} />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item component={Link} to="/profile">Profile</Menu.Item>
                <Menu.Item color="red" onClick={logout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <Button 
                component={Link} 
                to="/login" 
                variant="subtle" 
                color="blue" 
                size="sm"
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="filled" 
                color="blue" 
                size="sm"
              >
                Register
              </Button>
            </>
          )}
        </Group>
      </Group>
    </Container>
  );
}