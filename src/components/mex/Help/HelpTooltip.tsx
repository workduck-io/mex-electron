import React, { forwardRef } from 'react'
import styled from 'styled-components'
import questionMark from '@iconify-icons/ri/question-mark'
import { useHelpStore } from '../../../store/useHelpStore'
import { NavButton } from '../../../style/Nav'
import { GetIcon } from '../../../data/links'

const HelpTooltip = forwardRef<any>((_props, ref) => {
  const toggleModal = useHelpStore((store) => store.toggleModal)
  return (
    <NavButton
      key={`nav_help_modal`}
      // Tooltip
      onClick={toggleModal}
      ref={ref}
    >
      {GetIcon(questionMark)}
    </NavButton>
  )
})

HelpTooltip.displayName = 'HelpTooltip'

export default HelpTooltip
