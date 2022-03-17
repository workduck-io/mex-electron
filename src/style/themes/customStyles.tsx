import { HackerStyles } from './hackerTheme.custom'
import { ImperialStyles } from './imperialTheme.custom'
import { NeoLightStyles } from './neoLight.custom'
import { NeoDarkStyles } from './neoDark.custom'
import { RenarStyles } from './renarTheme.custom'
import { SpaceBlocksCss } from './spaceBlocks'
import { css } from 'styled-components'
import { transparentize } from 'polished'

const SpaceAmethyst = SpaceBlocksCss({
  containerStyle: css`
    background-color: #181c2b;
    box-shadow: 0px 15px 40px ${({ theme }) => transparentize(0.9, theme.colors.palette.black)};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  `,
  containerStyleReset: css`
    background-color: transparent;
    box-shadow: none;
    border-radius: 0;
  `,
  heightMain: 'calc(100vh - 4rem)'
})

export const customStyles = {
  ImperialStyles,
  RenarStyles,
  HackerStyles,
  NeoLightStyles,
  NeoDarkStyles,
  SpaceAmethyst
}
