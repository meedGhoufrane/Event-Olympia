import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HomePage } from './pages/HomePage';
import '@mantine/core/styles.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AllEventsPage } from './pages/AllEventsPage';
import { Dashboard } from './pages/dashbaord/Dashboard';
import { Profile } from './pages/Profile';
import  ManageUsers  from './pages/admin/ManageUsers';
import ManageEvents from './pages/admin/ManageEvents';
import ManageTickets from './pages/admin/ManageTickets';
// import { Statistics } from './pages/admin/Statistics';
import { useState } from 'react';

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  colors: {
    blue: [
      '#E7F5FF',
      '#D0EBFF',
      '#A5D8FF',
      '#74C0FC',
      '#4DABF7',
      '#339AF0',
      '#228BE6',
      '#1C7ED6',
      '#1971C2',
      '#1864AB',
    ],
  },
});

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout toggleTheme={toggleTheme} theme={currentTheme} />}>
                <Route index element={<HomePage />} />
                <Route path="events" element={<AllEventsPage />} />
                <Route path="login" element={<ProtectedRoute type="guest"><Login /></ProtectedRoute>} />
                <Route path="register" element={<ProtectedRoute type="guest"><Register /></ProtectedRoute>} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute type="auth">
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<ManageUsers />} />
                        <Route path="events" element={<ManageEvents />} />
                        <Route path="tickets" element={<ManageTickets />} />
                        {/* <Route path="statistics" element={<Statistics />} /> */} 
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;