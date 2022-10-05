import React from 'react'

import Tippy from '@tippyjs/react'
import { useContextMenu } from 'react-contexify'

import PriorityMenu from '../../../editor/Components/Todo/PriorityMenu'
import { Priority, PriorityDataType, PriorityType } from '../../../editor/Components/Todo/types'
import { MexIcon } from '../../../style/Layouts'
import { TodoActionButton, TodoActionWrapper } from '../Todo.style'

interface PriorityMenuSelect {
  id: string
  value: PriorityType
  onPriorityChange: (priority: PriorityDataType) => void
  withLabel?: boolean
}

const PrioritySelect = ({ id, value, onPriorityChange, withLabel = false }: PriorityMenuSelect) => {
  const menuId = `${id}-priority-menu`
  const { show, hideAll } = useContextMenu({ id: menuId })
  const onPriorityChangeClose = (priority: PriorityDataType) => {
    onPriorityChange(priority)
    hideAll()
  }
  return (
    <>
      <TodoActionWrapper onClick={show}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="bottom"
          appendTo={() => document.body}
          theme="mex"
          content={Priority[value]?.title}
        >
          <TodoActionButton>
            <MexIcon onClick={show} icon={Priority[value]?.icon?.value} fontSize={20} cursor="pointer" />
            {withLabel && <span>{Priority[value]?.title}</span>}
          </TodoActionButton>
        </Tippy>
      </TodoActionWrapper>
      <PriorityMenu id={menuId} onClick={onPriorityChangeClose} />
    </>
  )
}

export default PrioritySelect
