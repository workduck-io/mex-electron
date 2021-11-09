import React from 'react'
import Loading from '../Styled/Loading'
import Centered from '../Styled/Layouts'

export type TasksProps = {
  title?: string
}

const Tasks: React.FC<TasksProps> = () => {
  return (
    <Centered>
      <Loading dots={6} />
    </Centered>
  )
}

export default Tasks
