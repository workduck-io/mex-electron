import { css } from 'styled-components'
import { FOCUS_MODE_OPACITY } from './consts'
import { FocusModeProp } from './props'

export const focusStyles = ({ focusMode, focusHover }: FocusModeProp) => {
  if (focusMode)
    return focusHover
      ? css`
          opacity: 1;
        `
      : css`
          opacity: ${FOCUS_MODE_OPACITY};
        `
}
