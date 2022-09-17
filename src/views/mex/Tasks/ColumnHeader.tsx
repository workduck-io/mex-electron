import React from 'react'
import { TaskColumnHeader, TaskColumnHeaderDetails } from '@style/Todo'
import { IconButton } from '@workduck-io/mex-components'
import IconPlus from '@iconify/icons-bi/plus'

type ColumnHeaderProps = {
  title: string
  cards?: any
}

const ColumnHeader = ({ title, cards }) => {
  return <TaskColumnHeader>
    <TaskColumnHeaderDetails>
      {title}
      {cards.length > 0 && <span>{cards?.length}</span>}
    </TaskColumnHeaderDetails>
  </TaskColumnHeader>
}

export default ColumnHeader
