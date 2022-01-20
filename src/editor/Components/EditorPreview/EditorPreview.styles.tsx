import { transparentize } from 'polished'
import styled from 'styled-components'
import { CardShadow } from '../../../Styled/helpers'

export const EditorPreviewWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;

  backdrop-filter: blur(8px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.fade};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  min-width: 400px;
`
