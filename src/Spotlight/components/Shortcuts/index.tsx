import React from 'react'
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

const Shortcut = styled.div`
  font-size: 10px;
  color: black;
  font-weight: bold;
  margin-right: 2rem;
`

export const StyledKey = styled.span`
  padding: 0 4px;
  border-radius: 5px;
  margin: 0 5px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.gray[8]};
  box-shadow: 2px 2px 2px ${({ theme }) => theme.colors.gray[9]};
`

export enum ShortcutType {
  NEW,
  HOME,
}

const Shortcuts: React.FC<{ type: ShortcutType }> = ({ type }) => {
  if (type === ShortcutType.NEW) {
    return (
      <StyledShortcuts justifyContent="space-between">
        <Shortcut>
          <StyledKey>CMD+S</StyledKey> TO SAVE
        </Shortcut>
        <Shortcut>
          <StyledKey>ESC</StyledKey> TO DISMISS
        </Shortcut>
      </StyledShortcuts>
    )
  }

  return (
    <StyledShortcuts>
      <Shortcut>
        <StyledKey>ENTER</StyledKey> TO SELECT
      </Shortcut>
      <Shortcut>
        <StyledKey>ESC</StyledKey> TO DISMISS
      </Shortcut>
    </StyledShortcuts>
  )
}

export default Shortcuts
