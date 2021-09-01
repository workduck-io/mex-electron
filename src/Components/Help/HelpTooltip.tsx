import React from 'react'
import styled from 'styled-components'
import { useHelpStore } from './HelpModal'

const SHelpTooltip = styled.div`
  position: absolute;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
  font-weight: bold;
  font-size: 2rem;
  bottom: ${({ theme }) => theme.spacing.medium};
  right: ${({ theme }) => theme.spacing.medium};
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  color: ${({ theme }) => theme.colors.fade};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`

const HelpTooltip = () => {
  const openModal = useHelpStore((store) => store.openModal)
  return <SHelpTooltip onClick={openModal}>?</SHelpTooltip>
}

export default HelpTooltip
