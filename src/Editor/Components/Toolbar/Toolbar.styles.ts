import { createStyles } from '@udecode/plate-styled-components'
import { css } from 'styled-components'
import { ToolbarProps } from './Toolbar.types'

export const getToolbarStyles = (props: ToolbarProps) =>
  createStyles(
    { prefixClassNames: 'Toolbar', ...props },
    {
      root: [
        css`
          display: flex;
          align-items: center;
          user-select: none;
          box-sizing: content-border-box;
          color: rgb(68, 68, 68);
          min-height: 40px;
        `
      ]
    }
  )
