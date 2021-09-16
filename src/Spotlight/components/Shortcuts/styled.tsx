import styled from 'styled-components'

type ContentType = {
  justifyContent?: string
}

export const StyledShortcuts = styled.section<ContentType>`
  display: flex;
  width: 100%;
  margin-top: 0.5rem;
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: center;
`

export const Shortcut = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.fade};
  font-weight: bold;
  margin-right: 2rem;
`

export const StyledKey = styled.span`
  padding: 0 4px;
  border-radius: 5px;
  margin: 0 5px;
  color: ${({ theme }) => theme.colors.background.card};
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 2px 2px 2px ${({ theme }) => theme.colors.gray[9]};
`
