import { Icon } from '@iconify/react';
import React from 'react';
import styled, { css } from 'styled-components';
import { centeredCss } from './Layouts';

interface ButtonProps {
  highlight?: boolean;
}

export const Button = styled.div<ButtonProps>`
  ${centeredCss};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.gray.s5};
  }

  ${({ theme, highlight }) =>
    highlight
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.primary};
        `
      : ``}
`;

export type IconButtonProps = {
  icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  title: string;
  size?: string | number;
  onClick?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  highlight?: boolean;
};

export const HeadlessButton = styled.button`
  border: none;
  background: transparent;
`;

const IconButton: React.FC<IconButtonProps> = ({ icon, title, size, onClick, highlight }: IconButtonProps) => {
  return (
    <Button onClick={onClick} highlight={highlight} data-tip={title} data-place="bottom">
      <Icon icon={icon} height={size} />
    </Button>
  );
};

export default IconButton;
