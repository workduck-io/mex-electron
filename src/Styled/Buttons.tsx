import Icon from '@iconify/react';
import React from 'react';
import styled from 'styled-components';

const Button = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.gray.dark};
  }
`;

export type IconButtonProps = {
  icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  title: string;
  size?: string | number;
  onClick?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  title,
  size,
  onClick,
}: IconButtonProps) => {
  return (
    <Button onClick={onClick} data-tip={title} data-place="bottom">
      <Icon icon={icon} height={size} />
    </Button>
  );
};

export default IconButton;
