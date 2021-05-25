import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledDiv = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.background.sidebar};
  width: ${({ theme }) => theme.width.nav};
`;

const Link = styled(NavLink)`
  margin-top: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.small};
  &:first-child {
    margin-top: 0;
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
  console.log({ links });
  return (
    <StyledDiv>
      {links.map((l) => (
        <Link exact to={l.path} key={`nav_${l.title}`}>
          {l.icon !== undefined ? l.icon : l.title}
        </Link>
      ))}
    </StyledDiv>
  );
};

export default Nav;
