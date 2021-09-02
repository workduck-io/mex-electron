import React from 'react'
import styled from 'styled-components'
import { useHelpStore } from './HelpModal'

const SHelpTooltip = styled.div`
  position: absolute;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
  font-weight: 400;
  font-size: 1.5rem;
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
  const toggleModal = useHelpStore((store) => store.toggleModal)
  return <SHelpTooltip onClick={toggleModal}>?</SHelpTooltip>
}

export default HelpTooltip
