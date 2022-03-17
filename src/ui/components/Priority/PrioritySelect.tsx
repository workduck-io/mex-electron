import Tippy from '@tippyjs/react'
import React from 'react'
import { useContextMenu } from 'react-contexify'
import PriorityMenu from '../../../editor/Components/Todo/PriorityMenu'
import { Priority, PriorityDataType, PriorityType } from '../../../editor/Components/Todo/types'
import { MexIcon } from '../../../style/Layouts'
import { PriorityButton, TaskPriority } from '../Todo.style'

interface PriorityMenuSelect {
  id: string
  value: PriorityType
  onPriorityChange: (priority: PriorityDataType) => void
  withLabel?: boolean
}

const PrioritySelect = ({ id, value, onPriorityChange, withLabel = false }: PriorityMenuSelect) => {
  const menuId = `${id}-priority-menu`
  const { show } = useContextMenu({ id: menuId })
  return (
    <>
      <TaskPriority onClick={show}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="bottom"
          appendTo={() => document.body}
          theme="mex"
          content={Priority[value]?.title}
        >
          <PriorityButton>
            <MexIcon onClick={show} icon={Priority[value]?.icon} fontSize={20} cursor="pointer" />
            {withLabel && <span>{Priority[value]?.title}</span>}
          </PriorityButton>
        </Tippy>
      </TaskPriority>
      <PriorityMenu id={menuId} onClick={onPriorityChange} />
    </>
  )
}

export default PrioritySelect
