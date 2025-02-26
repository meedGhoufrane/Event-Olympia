import { Stack, Box } from '@mantine/core';
import { HeroSection } from '../components/homecontent/HeroSection';
import { FeaturesSection } from '../components/homecontent/FeaturesSection';
import { EventsSection } from '../components/homecontent/EventsSection';

export function HomePage() {
  return (
    <Box w="100%">
      {/* Hero Banner */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Featured Events Section */}
      <EventsSection />
    </Box>
  );
} 