/* eslint-disable react/prop-types */
import React from 'react'
import { Icon } from '@iconify/react'
import CreateIcon from '@iconify-icons/ph/lightning'
import {
  Action,
  ActionDesc,
  ActionDescStyled,
  ActionTitle,
  ColumnContainer,
  CreateMex,
  FlexBetween,
  StyledUndordered
} from './styled'
import Recent from '../Recent'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { useRecentsShortcuts } from '../../../Spotlight/shortcuts/useRecentsShortcuts'
import { StyledKey } from '../Shortcuts/styled'

const Actions = () => {
  const recents = useRecentsStore((state) => state.lastOpened)

  useRecentsShortcuts()

  return (
    <ColumnContainer>
      <Action>
        <ActionTitle>ACTIONS</ActionTitle>
        <CreateMex>
          <ActionDescStyled>
            <Icon style={{ marginRight: '5px' }} color="#888" height={20} width={20} icon={CreateIcon} />
            Create new Mex
          </ActionDescStyled>
          <StyledKey>TAB</StyledKey>
        </CreateMex>
      </Action>
      {recents.length === 0 ? (
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
      ) : (
        <Recent />
      )}
    </ColumnContainer>
  )
}

export default Actions
