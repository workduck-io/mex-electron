import React, { useState } from 'react'
import Loading from '../../Styled/Loading'
import { DivButtonProps, DivButton } from '../../Styled/Buttons'

export interface LoadingButtonProps {
  children?: React.ReactNode
  task: () => Promise<void>
  /** Also disable the button with a boolean condition */
  alsoDisabled?: boolean
  buttonProps?: DivButtonProps
}

export const LoadingButton = ({ children, task, alsoDisabled, buttonProps }: LoadingButtonProps) => {
  const [loading, setLoading] = useState(false)

  const executeFunction = async () => {
    if (!loading || !alsoDisabled) {
      setLoading(true)
      await task()
      setLoading(false)
    }
  }

  return (
    <DivButton
      onClick={executeFunction}
      disabled={alsoDisabled || loading}
      style={loading ? { ...{ paddingRight: '50px', paddingLeft: '50px' } } : {}}
      {...buttonProps}
    >
      {!loading && children}
      {loading && <Loading dots={5} />}
    </DivButton>
  )
}
