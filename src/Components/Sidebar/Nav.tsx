import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import settings4Line from '@iconify-icons/ri/settings-4-line';
import { GetIcon } from '../../Conf/links';
import { NavProps } from './Types';

const StyledDiv = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    box-shadow: 0px 4px 8px ${({ theme }) => theme.colors.primary};
  }
`;

const Nav: React.FC<NavProps> = ({ links }: NavProps) => {
  return (
    <StyledDiv>
      <div />
      <div>
        {links.map(l => (
          <Link
            exact
            activeClassName="active"
            to={l.path}
            key={`nav_${l.title}`}
            // Tooltip
            data-tip={l.title}
            data-class="nav-tooltip"
          >
            {l.icon !== undefined ? l.icon : l.title}
          </Link>
        ))}
      </div>
      <div>
        <Link
          exact
          activeClassName="active"
          to="/settings"
          key="nav_settings"
          // Tooltip
          data-tip="Settings"
          data-class="nav-tooltip"
        >
          {GetIcon(settings4Line)}
          {/* <Icon icon={settings4Line} /> */}
        </Link>
      </div>
    </StyledDiv>
  );
};

export default Nav;
