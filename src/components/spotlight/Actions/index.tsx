/* eslint-disable react/prop-types */
import CreateIcon from '@iconify/icons-ph/lightning'
import { Icon } from '@iconify/react'
import React from 'react'
import { useRecentsShortcuts } from '../../../hooks/listeners/useRecentsShortcuts'
import { StyledKey } from '../Shortcuts/styled'
import { Action, ActionDesc, ActionDescStyled, ActionTitle, CreateMex, FlexBetween, StyledUndordered } from './styled'

const Actions = () => {
  useRecentsShortcuts()

  return (
    <>
      <Action>
        <ActionTitle>ACTIONS</ActionTitle>
        <CreateMex data-tour="mex-create-new-draft">
          <ActionDescStyled>
            <Icon style={{ marginRight: '5px' }} color="#888" height={20} width={20} icon={CreateIcon} />
            Create new Mex
          </ActionDescStyled>
          <StyledKey>Enter</StyledKey>
        </CreateMex>
      </Action>
      <Action>
        <ActionTitle>MEX IT</ActionTitle>
        <FlexBetween>
          <ActionDesc>
            To use Mex It, re-open Spotlight while:
            <StyledUndordered>
              <li>visiting a webpage, or </li>
              <li>you have text selected</li>
            </StyledUndordered>
          </ActionDesc>
        </FlexBetween>
      </Action>
    </>
  )
}

export default Actions
