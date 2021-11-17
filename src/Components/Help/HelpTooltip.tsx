import React from 'react'
import styled from 'styled-components'
import { useHelpStore } from './HelpModal'
import { Icon } from '@iconify/react'
import questionMark from '@iconify-icons/ri/question-mark'
import { GetIcon } from '../../Conf/links'
const SHelpTooltip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

const HelpTooltip = () => {
  const toggleModal = useHelpStore((store) => store.toggleModal)
  return (
    <SHelpTooltip
      key={`nav_help_modal`}
      // Tooltip
      data-tip="Help"
      data-class="nav-tooltip"
      onClick={toggleModal}
    >
      {GetIcon(questionMark)}
    </SHelpTooltip>
  )
}

export default HelpTooltip
