import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { centeredCss } from './Layouts'
import { LoadingWrapper } from './Loading'

export const HeadlessButton = styled.button`
  border: none;
  background: transparent;
`

export interface AsyncButtonProps {
  children?: React.ReactNode
  primary?: boolean
  large?: boolean
  highlight?: boolean
  disabled?: boolean
  form?: string
  style?: any
  id?: string
  onClick?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  type?: 'button' | 'submit' | 'reset'
  transparent?: boolean
}

export const GoogleAuthButton = styled.button<AsyncButtonProps>`
  ${centeredCss};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${() => '#000000'};
  cursor: pointer;
  transition: 0.3s ease;
  background-color: ${() => '#ffffff'};

  ${({ theme, large }) =>
    large
      ? css`
          padding: ${`${theme.spacing.small} ${theme.spacing.medium}`};
          font-size: 1.2rem;
        `
      : css`
          padding: ${({ theme }) => theme.spacing.small};
        `}

  ${({ theme, highlight, primary }) =>
    highlight
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          box-shadow: 0px 4px 8px
            ${({ theme }) => transparentize(0.33, primary ? theme.colors.primary : theme.colors.palette.black)};
        `
      : ''}


  ${({ theme, primary }) => css`
    &:hover {
      box-shadow: 0px 6px 12px ${transparentize(0.5, primary ? theme.colors.primary : theme.colors.palette.black)};
    }
  `}

  ${({ theme, primary }) =>
    primary
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          &:hover {
            background-color: ${theme.colors.fade.primary};
            color: ${theme.colors.text.oppositePrimary};
          }
        `
      : ''}

  ${({ theme, disabled }) =>
    disabled
      ? css`
          pointer-events: none;
          background-color: ${theme.colors.gray[9]};
          color: ${transparentize(0.75, theme.colors.text.fade)};
        `
      : ''}

  ${LoadingWrapper} {
    position: absolute;
    margin: auto;
  }
`
