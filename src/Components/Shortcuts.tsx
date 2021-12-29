import { shade } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { getSplitDisplayShortcut } from '../Lib/shortcuts'

const ShortcutWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`
const ShortcutMid = styled.div`
  opacity: 0.66;
`
const ShortcutBox = styled.div`
  font-size: 0.9rem;
  padding: 4px ${({ theme }) => theme.spacing.tiny};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  color: ${({ theme }) => theme.colors.primary};
`

export interface DisplayShortcutProps {
  shortcut: string
}

export const DisplayShortcut = ({ shortcut }: DisplayShortcutProps) => {
  const keys = getSplitDisplayShortcut(shortcut)
  return (
    <ShortcutWrapper>
      {keys.map((k, i) => (
        <>
          <ShortcutBox>{k}</ShortcutBox>
          {i !== keys.length - 1 && <ShortcutMid>+</ShortcutMid>}
        </>
      ))}
    </ShortcutWrapper>
  )
}

const TooltipShortcut = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  ${ShortcutWrapper} {
    gap: 1px;
  }
  ${ShortcutBox} {
    font-size: 0.75rem;
    background-color: ${({ theme }) => shade(0.1, theme.colors.primary)};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`
export interface TooltipTitleWithShortcutProps {
  title: string
  shortcut: string
}

export const TooltipTitleWithShortcut = ({ title, shortcut }: TooltipTitleWithShortcutProps) => {
  return (
    <TooltipShortcut>
      {title} <DisplayShortcut shortcut={shortcut} />
    </TooltipShortcut>
  )
}