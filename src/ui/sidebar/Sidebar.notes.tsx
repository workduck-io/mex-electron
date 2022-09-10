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
    const nspaces = nodesByNamespaces.map(
      (ns) =>
        ({
          id: ns.id,
          label: ns.name,
          icon: ns.name === RESERVED_NAMESPACES.default ? 'ri:user-line' : undefined,
          tooltip: 'All Notes',
          list: {
            type: 'hierarchy',
            items: ns.nodes
          },
          popularTags: mostUsedTags,
          pinnedItems: () => <StarredNotes />,
          pollAction: PollActions.hierarchy
        } as SidebarSpace)
    )
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

    mog('Spaces', { spaces: nspaces, nodesByNamespaces })

    return nspaces
  }, [ilinks, namespaces])

  const changeIndex = (newIndex: number) => {
    if (newIndex === index.current) return
    const nextSpaceId = spaces[newIndex]?.id
    if (nextSpaceId) {
      changeSidebarSpace(nextSpaceId)
    }
  }

  const currentSpace = spaces[index.current]
  // const onClick = useCallback(() => set(state => (state + 1) % 3), [])
  const transRef = useSpringRef()
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: (item) => {
      // console.log({ item })
      const direction = item.prev > -1 ? Math.sign(item.current - item.prev) : 1
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: (item) => {
      // console.log({ item })
      const direction = item.prev > -1 ? Math.sign(item.current - item.prev) : -1
      return { opacity: 0, transform: `translate3d(${direction * 100}%,0,0)` }
    }
  })

  usePolling()

  useEffect(() => {
    // setIndex((s) => ({ current: newIndex, prev: s.current }))
    const newIndex = spaces.findIndex((s) => s.id === spaceId)
    if (newIndex === -1) return
    setIndex((s) => ({ current: newIndex, prev: s.current }))
  }, [spaceId, spaces])

  useEffect(() => {
    transRef.start()
  }, [index])

  useEffect(() => {
    if (currentSpace.pollAction) {
      replaceAndAddActionToPoll(currentSpace.pollAction)
    }
  }, [currentSpace])

  mog('Space', { ilinks, spaces, currentSpace, index })

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
