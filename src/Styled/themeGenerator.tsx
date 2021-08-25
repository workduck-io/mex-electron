import { getLuminance, mix, tint } from 'polished'
import { DefaultTheme } from 'styled-components'
import { LayoutStyle } from '../styled'
import merge from 'deepmerge'

const LayoutTheme: LayoutStyle = {
  spacing: {
    large: '2rem',
    medium: '1rem',
    small: '0.5rem',
    tiny: '0.25rem'
  },
  borderRadius: {
    large: '1rem',
    small: '0.5rem',
    tiny: '0.25rem'
  },
  width: {
    nav: 48,
    sidebar: 300
  },
  indent: {
    sidebar: 8
  }
}

export interface ShadePalette {
  10: string // Darkest
  9: string
  8: string
  7: string
  6: string
  5: string
  4: string
  3: string
  2: string
  1: string // Lightest
}

export interface ColorPalette {
  white: string
  black: string
  green: string
  yellow: string
  red: string
}

export interface TextPalette {
  heading: string
  default: string
  subheading: string
  fade: string
  disabled: string
  accent: string
  oppositePrimary: string
}

export interface ButtonPalette {
  default: string
  hover: string
  focus: string
  active: string
  disabled: string
}

export interface ThemePalette {
  // Colors
  primary: string
  secondary: string

  // Palettes
  gray: ShadePalette
  palette: ColorPalette

  text?: TextPalette
}

export const generateTheme = (p: ThemePalette): DefaultTheme => {
  const mp = (c: string) => mix(0.033, p.primary, c)
  return merge(
    {
      ...LayoutTheme,
      colors: {
        primary: p.primary,
        secondary: p.secondary,

        //
        palette: p.palette,
        gray: p.gray,

        //
        background: {
          app: p.gray[10],
          card: p.gray[9],
          modal: p.gray[9],
          sidebar: p.gray[10],
          highlight: p.gray[8]
        },
        divider: p.gray[4],
        fade: {
          primary: tint(0.15, p.primary),
          secondary: tint(0.15, p.secondary),
          background: tint(0.15, p.gray[10])
        },
        form: {
          input: {
            bg: mix(0.5, p.gray[8], p.gray[9]),
            fg: mp(p.gray[1]),
            border: mp(p.gray[8])
          },
          button: {
            bg: mp(p.gray[7]),
            fg: mp(p.gray[1]),
            border: mp(p.gray[8]),
            hover: mp(p.primary)
          }
        },
        text: p.text ?? {
          heading: mp(p.gray[1]),
          subheading: mp(p.gray[2]),
          default: mp(p.gray[2]),
          fade: mp(p.gray[4]),
          disabled: mp(p.gray[5]),
          accent: mp(p.gray[3]),
          oppositePrimary: getLuminance(p.gray[5]) >= getLuminance(p.primary) ? p.gray[10] : p.gray[1]
        }
      }
    },
    p
  )
}
