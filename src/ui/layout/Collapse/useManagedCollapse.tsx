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

  // const [collapsed, setCollapsed] = useState<string[]>(
  //   states.reduce((acc, s) => {
  //     if (!s.open) return [...acc, s.key]
  //     else return acc
  //   }, [])
  // )

  // const isOverflowing = () => {
  //   if (!wrapperRef.current) {
  //     // console.log('no wrapper ref')
  //     return false
  //   }
  //   const elScrollHeight = wrapperRef.current.scrollHeight
  //   const elHeight = wrapperRef.current.clientHeight
  //   // mog('isOverflowing', { elScrollHeight, elHeight })
  //   return elScrollHeight > elHeight
  // }

  const setCollapse = (key: string, open: boolean) => {
    // const isOverflowingCond = isOverflowing()
    // mog('Managed setCollapse', { key, open, isOverflowingCond })
    // const newCollapsed = [...collapsed]
    const newManagedState = managedState.map((state) => {
      if (state.key === key) {
        state.open = open
        // if (!open) {
        //   newCollapsed.push(key)
        // } else if (newCollapsed.indexOf(key) !== -1) {
        //   newCollapsed.splice(newCollapsed.indexOf(key), 1)
        // }
      }

      // if (state.key !== key && isOverflowingCond) {
      //   if (collapsed.indexOf(state.key) === -1) {
      //     state.open = false
      //     newCollapsed.push(state.key)
      //   }
      // }

      return state
    })
    // setCollapsed(newCollapsed)
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
