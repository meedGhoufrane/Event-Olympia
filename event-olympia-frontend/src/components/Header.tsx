import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Group, Container, rem, Button, Burger, Drawer, Stack, Menu, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        padding: '18px 0',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <Container size="xl">
        <Group justify="space-between" h="100%">
          <Link to="/" style={{ 
            textDecoration: 'none',
            color: scrolled ? '#0D1530' : '#fff',
            fontSize: rem(28),
            fontWeight: 700,
            transition: 'all 0.3s ease',
            textShadow: scrolled ? 'none' : '1px 1px 2px rgba(0,0,0,0.3)',
          }}>
            Event Olympia
          </Link>
          
          <Burger
            opened={opened}
            onClick={open}
            color={scrolled ? '#0D1530' : '#fff'}
            display={{ base: 'block', md: 'none' }}
          />
          
          <Group gap={rem(30)} display={{ base: 'none', md: 'flex' }} style={{ flexGrow: 1, justifyContent: 'center' }}>
            <Link to="/events" style={{ 
              textDecoration: 'none',
              color: scrolled ? '#0D1530' : '#fff',
              fontSize: rem(16),
              fontWeight: 500,
              transition: 'color 0.3s',
              ':hover': { color: scrolled ? '#228BE6' : '#61dafb' },
            }}>
              Events
            </Link>
            <Link to="/schedule" style={{ 
              textDecoration: 'none',
              color: scrolled ? '#0D1530' : '#fff',
              fontSize: rem(16),
              fontWeight: 500,
              transition: 'color 0.3s',
              ':hover': { color: scrolled ? '#228BE6' : '#61dafb' },
            }}>
              Schedule
            </Link>
            <Link to="/speakers" style={{ 
              textDecoration: 'none',
              color: scrolled ? '#0D1530' : '#fff',
              fontSize: rem(16),
              fontWeight: 500,
              transition: 'color 0.3s',
              ':hover': { color: scrolled ? '#228BE6' : '#61dafb' },
            }}>
              Speakers
            </Link>
            <Link to="/about" style={{ 
              textDecoration: 'none',
              color: scrolled ? '#0D1530' : '#fff',
              fontSize: rem(16),
              fontWeight: 500,
              transition: 'color 0.3s',
              ':hover': { color: scrolled ? '#228BE6' : '#61dafb' },
            }}>
              About
            </Link>
            <Link to="/contact" style={{ 
              textDecoration: 'none',
              color: scrolled ? '#0D1530' : '#fff',
              fontSize: rem(16),
              fontWeight: 500,
              transition: 'color 0.3s',
              ':hover': { color: scrolled ? '#228BE6' : '#61dafb' },
            }}>
              Contact
            </Link>
          </Group>

          {isAuthenticated ? (
            <Menu>
              <Menu.Target>
                <Avatar radius="xl" size="md" style={{ cursor: 'pointer' }} />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={logout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group>
              <Button
                component={Link}
                to="/login"
                radius="xl"
                variant={scrolled ? "outline" : "subtle"}
                color={scrolled ? "blue" : "gray.0"}
                size="md"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                size="md"
              >
                Register
              </Button>
            </Group>
          )}
        </Group>
      </Container>
      
      <Drawer opened={opened} onClose={close} title="Menu" padding="xl" size="md">
        <Stack spacing="lg">
          <Link to="/events" style={{ textDecoration: 'none', color: '#333', fontSize: rem(18) }}>
            Events
          </Link>
          <Link to="/schedule" style={{ textDecoration: 'none', color: '#333', fontSize: rem(18) }}>
            Schedule
          </Link>
          <Link to="/speakers" style={{ textDecoration: 'none', color: '#333', fontSize: rem(18) }}>
            Speakers
          </Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#333', fontSize: rem(18) }}>
            About
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#333', fontSize: rem(18) }}>
            Contact
          </Link>
          
          {isAuthenticated ? (
            <Button onClick={logout} fullWidth>Logout</Button>
          ) : (
            <Stack spacing="md">
              <Button component={Link} to="/login" fullWidth variant="subtle">Login</Button>
              <Button component={Link} to="/register" fullWidth>Register</Button>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </header>
  );
}