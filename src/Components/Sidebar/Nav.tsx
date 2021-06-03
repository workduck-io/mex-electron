import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const StyledDiv = styled('div')`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.background.sidebar};
  width: ${({ theme }) => theme.width.nav};
`;

export const navTooltip = css`
  .nav-tooltip {
    background: ${({ theme }) => theme.colors.primary} !important;
    &::after {
      border-right-color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`;

const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export interface NavLinkData {
  path: string;
  title: string;
  icon?: React.ReactNode;
}

export type NavProps = {
  links: NavLinkData[];
};

const Nav: React.FC<NavProps> = ({ links }: NavProps) => {
  return (
    <StyledDiv>
      {links.map((l) => (
        <Link
          exact
          to={l.path}
          key={`nav_${l.title}`}
          // Tooltip
          data-tip={l.title}
          data-class="nav-tooltip"
        >
          {l.icon !== undefined ? l.icon : l.title}
        </Link>
      ))}
    </StyledDiv>
  );
};

export default Nav;
