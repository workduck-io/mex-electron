import { transparentize } from 'polished'
import MexIcons, { MexNodeIcons } from '../components/icons/Icons'
import { css } from 'styled-components'

type Pixels = number // Pixels in integer

export const HoverFade = css`
  opacity: 0.5;
  transition: opacity 0.25s ease-in-out;
  &:hover {
    opacity: 1;
  }
`

export const SubtleGlow = css`
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0px 2px 6px ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};
`

export const HoverSubtleGlow = css`
  transition: 0.3s ease;
  &:hover {
    transition: 0s ease;
    ${SubtleGlow}
  }
`

export const PixelToCSS = (x: Pixels): string => {
  return `${String(x)}px`
}

export const ThinScrollbar = css`
  scrollbar-color: dark;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[8]};
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
`

export const CardShadow = css`
  box-shadow: 0px 3px 9px ${({ theme }) => transparentize(0.5, theme.colors.palette.black)};
`

export const getLineIcons = (icon: string) => {
  if (MexIcons[icon]) return MexIcons[icon]
}

export const dashedBack = (color: string, backColor: string) =>
  `background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='${encodeURIComponent(
    color
  )}' stroke-width='4' stroke-dasharray='20%2c 30' stroke-dashoffset='-8' stroke-linecap='round'/%3e%3c/svg%3e"),
repeating-linear-gradient(30deg, ${backColor}, ${backColor} 30px, ${transparentize(
    0.1,
    backColor
  )} 30px, ${transparentize(0.1, backColor)} 60px);
  ;`

export const getLineIconsIconify = (icon: string) => {
  if (MexNodeIcons[icon]) return MexNodeIcons[icon]
}
