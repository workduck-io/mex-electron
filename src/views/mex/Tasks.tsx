import React from 'react'
import Loading from '../Styled/Loading'
import Centered from '../Styled/Layouts'
import { LoadingButton } from '../Components/Buttons/LoadingButton'

export type TasksProps = {
  title?: string
}

const Tasks: React.FC<TasksProps> = () => {
  const loadingB = async () => {
    return 'oK'
  }
  return (
    <Centered>
      <div>
        <Loading dots={6} />
        <br />
        <LoadingButton buttonProps={{ onClick: loadingB }} loading={true}>
          This is content
        </LoadingButton>
        <br />
        <LoadingButton buttonProps={{ onClick: loadingB }} loading={false}>
          This is content
        </LoadingButton>
        <br />
        <LoadingButton buttonProps={{ onClick: loadingB, large: true }} loading={true}>
          This is Large
        </LoadingButton>
        <br />
        <LoadingButton buttonProps={{ onClick: loadingB, large: true }} loading={false}>
          This is Large
        </LoadingButton>
        <br />
        <LoadingButton buttonProps={{ onClick: loadingB, large: true, primary: true }} loading={true}>
          This is Large
        </LoadingButton>
        <br />
        <LoadingButton buttonProps={{ onClick: loadingB, large: true, primary: true }} loading={false}>
          This is Large
        </LoadingButton>
      </div>
    </Centered>
  )
}

export default Tasks
