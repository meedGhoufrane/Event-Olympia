import { Container, Group, Text, Stack, rem, Box, SimpleGrid, Input, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

// SVG Icons for the footer
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4DABF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4DABF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4DABF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0D1530',
      padding: `${rem(80)} 0 ${rem(20)}`,
      color: '#fff',
      backgroundImage: 'url("/assets/pattern-dark.svg")',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay',
    }}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={rem(40)}>
          {/* Column 1 - About */}
          <Stack spacing={rem(20)}>
            <Text size="xl" fw={700} mb={rem(10)}>Event Olympia</Text>
            <Text size="sm" c="dimmed" maw={400}>
              Your ultimate platform for creating, managing, and discovering amazing events. Join our community of event organizers and attendees.
            </Text>
            
            <Group spacing={rem(15)}>
              <Box
                component="a"
                href="#"
                target="_blank" 
                style={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: rem(36),
                  height: rem(36),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#4DABF7',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <FacebookIcon />
              </Box>
              <Box
                component="a"
                href="#"
                target="_blank" 
                style={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: rem(36),
                  height: rem(36),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#4DABF7',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <TwitterIcon />
              </Box>
              <Box
                component="a"
                href="#"
                target="_blank" 
                style={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: rem(36),
                  height: rem(36),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#4DABF7',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <InstagramIcon />
              </Box>
              <Box
                component="a"
                href="#"
                target="_blank" 
                style={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: rem(36),
                  height: rem(36),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#4DABF7',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <LinkedInIcon />
              </Box>
            </Group>
          </Stack>
          
          {/* Column 2 - Quick Links */}
          <Stack spacing={rem(10)}>
            <Text fw={700} mb={rem(15)} size="lg">Quick Links</Text>
            <Link to="/events" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: `${rem(5)} 0`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#4DABF7',
                transform: 'translateX(5px)',
              }
            }}>
              Events
            </Link>
            <Link to="/schedule" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: `${rem(5)} 0`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#4DABF7',
                transform: 'translateX(5px)',
              }
            }}>
              Event Schedule
            </Link>
            <Link to="/speakers" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: `${rem(5)} 0`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#4DABF7',
                transform: 'translateX(5px)',
              }
            }}>
              Speakers
            </Link>
            <Link to="/about" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: `${rem(5)} 0`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#4DABF7',
                transform: 'translateX(5px)',
              }
            }}>
              About Us
            </Link>
            <Link to="/contact" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: `${rem(5)} 0`,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#4DABF7',
                transform: 'translateX(5px)',
              }
            }}>
              Contact
            </Link>
          </Stack>

          {/* Column 3 - Contact Info */}
          <Stack spacing={rem(15)}>
            <Text fw={700} mb={rem(10)} size="lg">Contact Info</Text>
            <Group spacing={rem(10)} noWrap align="flex-start">
              <Box style={{ marginTop: rem(3) }}>
                <LocationIcon />
              </Box>
              <Text size="sm">123 Event Street, Conference Avenue, San Francisco, CA 94158</Text>
            </Group>
            <Group spacing={rem(10)} noWrap>
              <PhoneIcon />
              <Text size="sm">+1 234 567 8900</Text>
            </Group>
            <Group spacing={rem(10)} noWrap>
              <EmailIcon />
              <Text size="sm">info@eventolympia.com</Text>
            </Group>
          </Stack>
          
          {/* Column 4 - Newsletter */}
          <Stack spacing={rem(10)}>
            <Text fw={700} mb={rem(10)} size="lg">Newsletter</Text>
            <Input.Wrapper>
              <Input placeholder="Your email" />
            </Input.Wrapper>
            <Button fullWidth>Subscribe</Button>
          </Stack>
        </SimpleGrid>

        <Text ta="center" mt={rem(60)} pt={rem(20)} size="sm" c="dimmed"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          © {new Date().getFullYear()} Event Olympia. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}