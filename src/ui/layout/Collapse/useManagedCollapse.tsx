import { ManagedOpenState } from '@ui/sidebar/Sidebar.types'
import { mog } from '@workduck-io/mex-utils'
import React, { useMemo, useState } from 'react'

interface SingleCollapseState {
  key: string
  open: boolean
  height: string
}

interface MultiCollapseStateProps {
  states: Array<SingleCollapseState>
  wrapperRef: React.RefObject<HTMLDivElement>
}

/**
 * Manages the collapse state for a set of collapsibles
 * Collapse when overflow
 * Collapse prev opened collapse when a closed one is opened
 */
const useManagedCollapse = ({ states, wrapperRef }: MultiCollapseStateProps) => {
  const [managedState, setManagedState] = useState(states)

  const setCollapse = (key: string, collapse: boolean) => {
    mog('Managed setCollapse', { key, collapse })
    const newManagedState = managedState.map((state) => {
      if (state.key === key) {
        state.open = collapse
      }
      return state
    })
    setManagedState(newManagedState)
  }

  const managedStates = useMemo((): Record<string, ManagedOpenState> => {
    return managedState.reduce(
      (p, s) => ({
        ...p,
        [s.key]: {
          open: s.open,
          setOpen: (collapse: boolean) => setCollapse(s.key, collapse),
          height: s.height
        }
      }),
      {}
    )
  }, [managedState])

  // const
  return {
    managedState,
    managedStates,
    setCollapse
  }
}

export default useManagedCollapse
