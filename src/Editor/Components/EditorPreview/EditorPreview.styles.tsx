import { CardShadow } from '../../../Styled/helpers'
import styled from 'styled-components'

export const EditorPreviewWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.colors.gray[9]} !important;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.fade};
  max-height: 400px;
  max-width: 400px;
  overflow-y: auto;
  ${CardShadow}
  min-width: 400px;
`
