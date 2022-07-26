import { Value } from '@udecode/plate'
import { createStyles } from '@udecode/plate-styled-components'
import styled from 'styled-components'
import { ExcalidrawElementProps } from './ExcalidrawElement.types'

export const getExcalidrawElementStyles = (props: ExcalidrawElementProps<Value>) =>
  createStyles(
    { prefixClassNames: 'ExcalidrawElement', ...props },
    {
      excalidrawWrapper: { height: '600px' }
    }
  )

export const CanvasText = styled.div`
  padding-left: ${({ theme }) => theme.spacing.small};
  font-size: 0.85rem;
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};
  svg {
    color: ${({ theme }) => theme.colors.primary};
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
