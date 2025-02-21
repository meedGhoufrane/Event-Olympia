import { AppShell, Container, rem } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function MainLayout() {
    return (
        <AppShell
            header={{ height: rem(60) }}
            padding="md"
            styles={{
                main: {
                    background: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                },
            }}
        >

            <AppShell.Header>
                <Header />
            </AppShell.Header>
            <AppShell.Main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Container size="md" py="xl" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}