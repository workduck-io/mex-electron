import { createStyles } from '@udecode/plate-styled-components'
import { ExcalidrawElementProps } from './ExcalidrawElement.types'

export const getExcalidrawElementStyles = (props: ExcalidrawElementProps) =>
  createStyles(
    { prefixClassNames: 'ExcalidrawElement', ...props },
    {
      excalidrawWrapper: { height: '600px' }
    }
  )
