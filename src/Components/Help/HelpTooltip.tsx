import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { useHelpStore } from './HelpModal'
import questionMark from '@iconify-icons/ri/question-mark'
import { GetIcon } from '../../Conf/links'
import { NavButton } from '../../Styled/Nav'

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
