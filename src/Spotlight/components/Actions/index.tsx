/* eslint-disable react/prop-types */
import React from 'react'
import { Icon } from '@iconify/react'
import CreateIcon from '@iconify-icons/ph/lightning'
import { StyledKey } from '../Shortcuts'
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
// import Recent from '../Recent';

const Actions: React.FC<{ current: number }> = ({ current }) => {
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
    </ColumnContainer>
  )
}

export default Actions
