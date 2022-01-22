import styled, { css } from 'styled-components'

export const SwitchWrapper = styled.div``

interface SwitchButtonProps {
  state: boolean
}

export const SwitchButton = styled.div<SwitchButtonProps>`
  display: flex;
  cursor: pointer;
  vertical-align: middle;
  .theme-button {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.gray[7]};
    width: 78px;
    height: 36px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toggle {
    display: none;
    width: 100%;
    height: 100%;
  }

  .toggle-button {
    cursor: pointer;
    position: absolute;
    height: 40px;
    width: 40px;
    z-index: 0;
    border-radius: 20px;
    margin-left: -2px;
    margin-top: -2px;
    transition: all 0.25s ease-in-out;
    background-color: ${({ theme }) => theme.colors.primary};
    ${({ state, theme }) =>
      state
        ? css`
            margin-left: 40px;
          `
        : ''};
    @include sm {
      margin-top: 0px;
    }
  }

  &:hover {
    .toggle-button {
      box-shadow: 0px 4px 10px ${({ theme }) => theme.colors.primary};
    }
  }
`
