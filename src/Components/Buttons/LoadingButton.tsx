import React from 'react'
import { AsyncButton, AsyncButtonProps } from '../../Styled/Buttons'
import Loading from '../../Styled/Loading'

export interface LoadingButtonProps {
  children?: React.ReactNode
  loading?: boolean
  /** Also disable the button with a boolean condition */
  alsoDisabled?: boolean
  buttonProps?: AsyncButtonProps
}

export const LoadingButton = ({ children, loading, alsoDisabled, buttonProps }: LoadingButtonProps) => {
  return (
    <AsyncButton disabled={alsoDisabled || loading} {...buttonProps}>
      {!loading && children}
      {loading && <Loading transparent dots={5} />}
    </AsyncButton>
  )
}
