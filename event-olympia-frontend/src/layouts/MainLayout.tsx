import { AppShell, rem } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function MainLayout({ toggleTheme, theme }) {
  const location = useLocation();

  // Check if the current route is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AppShell
      header={{ height: rem(0) }}
      padding={0}
      styles={{
        main: {
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          paddingTop: 0, // Remove top padding to allow hero section to go behind header
          width: '100%',
        },
      }}
    >
      {!isAuthPage && (
        <AppShell.Header>
          <Header toggleTheme={toggleTheme} theme={theme} />
        </AppShell.Header>
      )}
      <AppShell.Main>
        <Outlet />
        {/* Conditionally render the Footer */}
        {!isAuthPage && <Footer />}
      </AppShell.Main>
    </AppShell>
  );
}