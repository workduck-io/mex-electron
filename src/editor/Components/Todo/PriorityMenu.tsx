import { Icon } from '@iconify/react'
import React from 'react'
import { Item } from 'react-contexify'
import styled from 'styled-components'
import { DisplayShortcut } from '../../../components/mex/Shortcuts'
import { StyledMenu } from '../../../style/Menu'
import { Priority, PriorityDataType } from './types'

type PriorityMenuType = {
  id: string
  onClick: (priority: PriorityDataType) => void
}

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

const Text = styled.span`
  font-size: 0.8rem;
`

const PriorityMenu: React.FC<PriorityMenuType> = ({ onClick, id }) => {
  return (
    <StyledMenu contentEditable={false} id={id}>
      {Object.values(Priority).map((priority) => {
        return (
          <Item key={priority.title} id={priority.title} onClick={() => onClick(priority)}>
            <StyledItem>
              <Icon icon={priority.icon} fontSize={16} />
              <Text>{priority.title}</Text>
            </StyledItem>

            {/* <DisplayShortcut shortcut={priority.shortcut.keystrokes} /> */}
          </Item>
        )
      })}
    </StyledMenu>
  )
}

export default PriorityMenu
