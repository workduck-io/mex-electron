import { SharedNodeIconify } from '@components/icons/Icons'
import StarredNotes from '@components/mex/Sidebar/StarredNotes'
import SharedNotes from '@components/mex/Sidebar/SharedNotes'
import useDataStore from '@store/useDataStore'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SidebarSpaceComponent } from './space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import { useTransition, useSpringRef } from '@react-spring/web'
import { useTags } from '@hooks/useTags'
import { PollActions, useApiStore } from '@store/useApiStore'
import { usePolling } from '@apis/usePolling'
import { useNamespaces } from '@hooks/useNamespaces'
import { RESERVED_NAMESPACES } from '@utils/lib/paths'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { mog } from '@workduck-io/mex-utils'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const namespaces = useDataStore((store) => store.namespaces)
  const spaceId = useUserPreferenceStore((store) => store.activeNamespace)
  const changeSidebarSpace = useUserPreferenceStore((store) => store.setActiveNamespace)
  const { getMostUsedTags } = useTags()
  const tags = useDataStore((s) => s.tags)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)
  const { getNodesByNamespaces } = useNamespaces()
  const isAnimate = useRef(false)

  const mostUsedTags = useMemo(() => {
    const topUsedTags = getMostUsedTags()
    return topUsedTags
  }, [tags])

  const spaces: Array<SidebarSpace> = useMemo(() => {
    const nodesByNamespaces = getNodesByNamespaces()
    const nspaces = nodesByNamespaces
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((ns) => {
        return {
          id: ns.id,
          label: ns.name,
          icon: ns.icon ?? {
            type: 'ICON',
            value: ns.name === RESERVED_NAMESPACES.default ? 'ri:user-line' : 'heroicons-outline:view-grid'
          },
          tooltip: ns.name,
          list: {
            type: 'hierarchy',
            items: ns.nodes
          },
          popularTags: mostUsedTags[ns.id] ?? undefined,
          pinnedItems: () => <StarredNotes />,
          pollAction: PollActions.hierarchy
        } as SidebarSpace
      })
    // .slice(0, 5)
    // Add shared notes namespace
    nspaces.push({
      id: 'NAMESPACE_shared',
      label: RESERVED_NAMESPACES.shared,
      tooltip: 'Shared Notes',
      icon: { type: 'ICON', value: 'mex:shared-note' },
      list: {
        type: 'flat',
        renderItems: () => <SharedNotes />
      },
      pollAction: PollActions.shared
    })

    // mog('Spaces', { spaces: nspaces, nodesByNamespaces })
    return nspaces
  }, [ilinks, namespaces])

  const [index, setIndex] = useState({
    current: spaces.findIndex((space) => space.id === spaceId),
    // Required to find direction of the animation
    prev: -1
  })

  const changeIndex = (newIndex: number, updateStores = true) => {
    if (newIndex === index.current) return
    const nextSpaceId = spaces[newIndex]?.id
    // mog('Changing index', { newIndex, index })
    if (nextSpaceId) {
      if (updateStores) {
        changeSidebarSpace(nextSpaceId)
        isAnimate.current = true
      } else {
        isAnimate.current = false
      }
      setIndex({ current: newIndex, prev: index.current })
    }
  }

  useEffect(() => {
    const newIndex = spaces.findIndex((s) => s.id === spaceId)
    if (newIndex === -1) return
    // if (newIndex === index.current) return
    changeIndex(newIndex, false)
  }, [spaceId, spaces])

  const currentSpace = spaces[index.current]

  const transRef = useSpringRef()
  const defaultStyles = { opacity: 1, transform: 'translate3d(0%,0,0)' }
  const fadeStyles = { opacity: 1, transform: 'translate3d(0%,0,0)' }
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: () => {
      // Skip if there is no previous index
      if (index.prev === -1) return defaultStyles
      if (!isAnimate.current) return fadeStyles
      const direction = index.prev > -1 ? Math.sign(index.current - index.prev) : 1
      // mog('from', { index, direction })
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    },
    enter: defaultStyles,
    leave: () => {
      // Skip if there is no previous index
      if (index.prev === -1) return defaultStyles
      if (!isAnimate.current) return fadeStyles
      const direction = index.prev > -1 ? -Math.sign(index.current - index.prev) : -1
      // mog('leave', { index, direction })
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    }
  })

  /**
   * Set initial namespace when not in preference
   */
  useEffect(() => {
    const currentNamespace = useUserPreferenceStore.getState().activeNamespace
    const selectedSpace = spaces?.[index.current]?.id

    if (!currentNamespace) {
      if (selectedSpace !== spaceId) {
        changeSidebarSpace(selectedSpace)
      }
      useUserPreferenceStore.getState().setActiveNamespace(selectedSpace)
    }
  }, [])

  usePolling()

  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    if (currentSpace?.pollAction) {
      replaceAndAddActionToPoll(currentSpace.pollAction)
    }
  }, [currentSpace])

  // mog('Space', { ilinks, spaces, currentSpace, index, spaceId })

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i.current]} style={style} />
        })}
      </SpaceContentWrapper>
      {/* currentSpace && <SidebarSpaceComponent style={} space={currentSpace} />*/}
      <SidebarSpaceSwitcher currentSpace={currentSpace?.id} spaces={spaces} setCurrentIndex={changeIndex} />
      {/* For testing purposes
        <SidebarSpaceSwitcher currentSpace={currentSpace?.id} spaces={spaces.slice(0, 4)} setCurrentIndex={changeIndex} />
        <SidebarSpaceSwitcher currentSpace={currentSpace?.id} spaces={spaces.slice(0, 6)} setCurrentIndex={changeIndex} />
        <SidebarSpaceSwitcher currentSpace={currentSpace?.id} spaces={spaces.slice(0, 8)} setCurrentIndex={changeIndex} />
      */}
    </SpaceWrapper>
  )
}
