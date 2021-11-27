import { mix } from 'polished'
import { DefaultTheme } from 'styled-components'

export const getEx = (level: number) => 1 - Math.pow(Math.E, -level / 4)

export const getNodeStyles = (level: number, theme: DefaultTheme) => {
  const { gray, primary } = theme.colors

  const colorBase = mix(0.15, gray[3], mix(0.9, gray[10], primary))
  const fontColorBase = mix(0.75, gray[2], primary)

  const color = mix(getEx(level), gray[10], colorBase)
  const fontColor = mix(getEx(level), gray[8], fontColorBase)

  return {
    color: {
      border: color,
      background: color,
      highlight: {
        border: mix(0.5, primary, color),
        background: mix(0.2, primary, color)
      },
      hover: {
        border: mix(0.2, primary, color),
        background: mix(0.3, primary, color)
      }
    },
    chosen: {
      label: (values) => {
        values.color = gray[2]
      }
    },
    font: {
      color: fontColor
    },
    shape: 'box'
  }
}

export const getEdgeGlobalStyles = (level: number, theme: DefaultTheme) => {
  const { gray, primary } = theme.colors

  const step = 0.1
  const colorBase = mix(0.15, gray[5], mix(0.5, gray[6], primary))
  const color = mix(level * step, gray[10], colorBase)

  return {
    color
  }
}

export const getEdgeLocalStyles = (cent: boolean, theme: DefaultTheme) => {
  const { secondary, gray } = theme.colors
  return {
    color: cent ? gray[6] : secondary
  }
}
