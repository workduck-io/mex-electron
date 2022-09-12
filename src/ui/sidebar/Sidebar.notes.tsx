import { SharedNodeIconify } from '@components/icons/Icons'
import StarredNotes from '@components/mex/Sidebar/StarredNotes'
import SharedNotes from '@components/mex/Sidebar/SharedNotes'
import useDataStore from '@store/useDataStore'
import React, { useEffect, useMemo, useState } from 'react'
import { SidebarSpaceComponent } from './Sidebar.space'
import { SidebarSpaceSwitcher } from './Sidebar.spaceSwitcher'
import { SpaceContentWrapper, SpaceWrapper } from './Sidebar.style'
import { SidebarSpace } from './Sidebar.types'
import { useTransition, useSpringRef } from '@react-spring/web'
import { useTags } from '@hooks/useTags'
import { PollActions, useApiStore } from '@store/useApiStore'
import { usePolling } from '@apis/usePolling'
import { useNamespaces } from '@hooks/useNamespaces'
import { RESERVED_NAMESPACES } from '@utils/lib/paths'
import { useLayoutStore } from '@store/useLayoutStore'
import { useUserPreferenceStore } from '@store/userPreferenceStore'

export const NoteSidebar = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const namespaces = useDataStore((store) => store.namespaces)
  const spaceId = useLayoutStore((store) => store.sidebar.spaceId)
  const changeSidebarSpace = useLayoutStore((store) => store.changeSidebarSpace)
  const [index, setIndex] = useState({ current: 0, prev: -1 })
  const { getMostUsedTags } = useTags()
  const tags = useDataStore((s) => s.tags)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)
  const { getNodesByNamespaces } = useNamespaces()
  // Required to find direction of the animation
  // const { getAllBookmarks } = useBookmarks()
  //

  const mostUsedTags = useMemo(() => {
    const topUsedTags = getMostUsedTags()
      .sort((a, b) => a.freq - b.freq)
      .reverse()
      .slice(0, 5)
      .map((t) => ({ value: t.tag }))
    // mog('AllTag', { allTagFreq })
    return topUsedTags
  }, [tags])

  const spaces: Array<SidebarSpace> = useMemo(() => {
    const nodesByNamespaces = getNodesByNamespaces()
    const nspaces = nodesByNamespaces
      .map(
        (ns) =>
          ({
            id: ns.id,
            label: ns.name,
            icon: ns.name === RESERVED_NAMESPACES.default ? 'ri:user-line' : 'heroicons-outline:view-grid',
            tooltip: ns.name,
            list: {
              type: 'hierarchy',
              items: ns.nodes
            },
            popularTags: mostUsedTags,
            pinnedItems: () => <StarredNotes />,
            pollAction: PollActions.hierarchy
          } as SidebarSpace)
      )
      .slice(0, 3)
    // Add shared notes namespace
    nspaces.push({
      id: 'shared',
      label: 'Shared Notes',
      tooltip: 'Shared Notes',
      icon: SharedNodeIconify,
      list: {
        type: 'flat',
        renderItems: () => <SharedNotes />
      },
      pollAction: PollActions.shared
    })

    // mog('Spaces', { spaces: nspaces, nodesByNamespaces })

    return nspaces
  }, [ilinks, namespaces])

  const changeIndex = (newIndex: number) => {
    if (newIndex === index.current) return
    const nextSpaceId = spaces[newIndex]?.id
    if (nextSpaceId) {
      useUserPreferenceStore.getState().setActiveNamespace(nextSpaceId)
      changeSidebarSpace(nextSpaceId)
      setIndex({ current: newIndex, prev: index.current })
    }
  }

  const currentSpace = spaces[index.current]

  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: () => {
      const direction = index.prev > -1 ? Math.sign(index.current - index.prev) : 1
      // mog('from', { item, index, direction, i })
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: () => {
      const direction = index.prev > -1 ? -Math.sign(index.current - index.prev) : -1
      // mog('leave', { item, index, direction, i })
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
      changeSidebarSpace(selectedSpace)
      useUserPreferenceStore.getState().setActiveNamespace(selectedSpace)
    }
  }, [])

  usePolling()

  // useEffect(() => {
  //   const newIndex = spaces.findIndex((s) => s.id === spaceId)
  //   if (newIndex === -1) return
  //   // if (newIndex === index.current) return
  //   changeIndex(newIndex)
  // }, [spaceId, spaces])

  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    if (currentSpace.pollAction) {
      replaceAndAddActionToPoll(currentSpace.pollAction)
    }
  }, [currentSpace])

  // mog('Space', { ilinks, spaces, currentSpace, index })

  return (
    <SpaceWrapper>
      <SpaceContentWrapper>
        {transitions((style, i) => {
          return <SidebarSpaceComponent space={spaces[i.current]} style={style} />
        })}
      </SpaceContentWrapper>
      {/* currentSpace && <SidebarSpaceComponent style={} space={currentSpace} />*/}
      <SidebarSpaceSwitcher currentSpace={currentSpace.id} spaces={spaces} setCurrentIndex={changeIndex} />
    </SpaceWrapper>
  )
}
