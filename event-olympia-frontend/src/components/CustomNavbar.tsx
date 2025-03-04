import React from 'react';
import { UnstyledButton, Group, Text, useMantineTheme } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface CustomNavbarProps {
  icon: React.FC<TablerIconsProps>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ icon: Icon, label, active, onClick }) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: active ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7] : theme.colors.gray[7],
        backgroundColor: active ? theme.colors[theme.primaryColor][0] : 'transparent',
        '&:hover': {
          backgroundColor: theme.colors[theme.primaryColor][0],
        },
      }}
    >
      <Group>
        <Icon size={16} />
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

export default CustomNavbar;