import searchLine from '@iconify-icons/ri/search-line'
import lockPasswordLine from '@iconify-icons/ri/lock-password-line'
import user3Line from '@iconify-icons/ri/user-3-line'
import settings4Line from '@iconify-icons/ri/settings-4-line'
import { transparentize } from 'polished'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { GetIcon } from '../../Conf/links'
import { useAuthentication, useAuthStore } from '../../Hooks/useAuth/useAuth'
import { useLayoutStore } from '../../Layout/LayoutStore'
import { Button } from '../../Styled/Buttons'
import { NavProps } from './Types'

interface StyledDivProps {
  focusMode?: boolean
}

const StyledDiv = styled.div<StyledDivProps>`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
  position: fixed;
  width: ${({ theme }) => theme.width.nav};
  transition: opacity 0.3s ease-in-out;

  ${({ focusMode }) =>
    focusMode &&
    css`
      opacity: 0.2;
      &:hover {
        opacity: 1;
      }
    `}
`

export const navTooltip = css`
  .nav-tooltip {
    background: ${({ theme }) => theme.colors.primary} !important;
    &::after {
      border-right-color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

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
    box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.33, theme.colors.primary)};
  }
`

const Nav: React.FC<NavProps> = ({ links }: NavProps) => {
  const { logout } = useAuthentication()
  const authenticated = useAuthStore((store) => store.authenticated)
  const focusMode = useLayoutStore((store) => store.focusMode)
  return (
    <StyledDiv focusMode={focusMode}>
      <div></div>
      <div>
        {links.map((l) => (
          <Link
            exact
            tabIndex={-1}
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
        {authenticated ? (
          <Link
            exact
            tabIndex={-1}
            activeClassName="active"
            to="/user"
            key="nav_user"
            // isActive={!authenticated}
            // Tooltip
            data-tip="User"
            data-class="nav-tooltip"
          >
            {GetIcon(user3Line)}
          </Link>
        ) : (
          <Link
            exact
            tabIndex={-1}
            activeClassName="active"
            to="/login"
            key="nav_user"
            className="active"
            // isActive={!authenticated}
            // Tooltip
            data-tip="Login"
            data-class="nav-tooltip"
          >
            {GetIcon(lockPasswordLine)}
          </Link>
        )} */}
        <Link
          exact
          tabIndex={-1}
          activeClassName="active"
          to="/search"
          key="nav_search"
          // Tooltip
          data-tip="Search"
          data-class="nav-tooltip"
        >
          {GetIcon(searchLine)}
          {/* <Icon icon={settings4Line} /> */}
        </Link>
        <Link
          exact
          tabIndex={-1}
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
  )
}

export default Nav
