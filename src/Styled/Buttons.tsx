import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { centeredCss } from './Layouts'
import { LoadingWrapper } from './Loading'

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  primary?: boolean
  large?: boolean
  highlight?: boolean
}

export const Button = styled.button<ButtonProps>`
  ${centeredCss};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.subheading};
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.5, theme.colors.primary)};
  }

  ${({ theme: { spacing }, large }) =>
    large
      ? css`
          padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
          margin: 0 ${({ theme }) => theme.spacing.small};
          font-size: 1.2rem;
        `
      : css`
          padding: ${({ theme }) => theme.spacing.small};
          margin: 0 ${({ theme }) => theme.spacing.tiny};
        `}

  ${({ theme, highlight }) =>
    highlight
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.33, theme.colors.primary)};
        `
      : ''}

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
`

export type IconButtonProps = {
  icon: any // eslint-disable-line @typescript-eslint/no-explicit-any
  title: string
  size?: string | number
  onClick?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  highlight?: boolean
}

export const HeadlessButton = styled.button`
  border: none;
  background: transparent;
`

const IconButton: React.FC<IconButtonProps> = ({ icon, title, size, onClick, highlight }: IconButtonProps) => {
  return (
    <Button onClick={onClick} highlight={highlight} data-tip={title} data-place="bottom">
      <Icon icon={icon} height={size} />
    </Button>
  )
}

export default IconButton

export interface AsyncButtonProps {
  children?: React.ReactNode
  primary?: boolean
  large?: boolean
  highlight?: boolean
  disabled?: boolean
  id?: string
  onClick?: any
  type?: 'button' | 'submit' | 'reset'
}

export const AsyncButton = styled.button<AsyncButtonProps>`
  ${centeredCss};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.subheading};
  cursor: pointer;
  transition: 0.3s ease;

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
