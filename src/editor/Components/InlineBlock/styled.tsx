import { StyledMessage } from '../../../components/spotlight/Message/styled'
import styled from 'styled-components'

export type InlineBlockType = {
  selected: boolean
}

export const StyledInlineBlockPreview = styled.div`
  max-height: 25vh;
  overflow-y: auto;
`

export const StyledInlineBlock = styled.section<InlineBlockType>`
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin: ${({ theme }) => theme.spacing.small} 0;
  padding: 0;

  transition: transform 0.2s ease-in;

  :hover {
    transform: translateY(-5px);
  }

  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.gray[8]};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};
`
export const InlineBlockHeading = styled.div`
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: large;
`

export const InlineBlockText = styled.div`
  margin-left: ${({ theme }) => theme.spacing.small};
  font-size: large;
  color: ${({ theme }) => theme.colors.primary};
`

export const InlineFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Chip = styled(StyledMessage)`
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.background.modal};
  }
`

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing.medium};
`