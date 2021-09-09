import React from 'react'
import { useNavigation } from './useNavigation'

// Used to wrap a class component to provide hooks
export const withNavigation = (Component: any) => {
  return function C2 (props: any) {
    const { push, move } = useNavigation()

    return <Component push={push} move={move} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
