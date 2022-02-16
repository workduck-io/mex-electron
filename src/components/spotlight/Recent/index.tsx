import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { NodeEditorContent } from '../../../types/Types'
import { ActionTitle } from '../Actions/styled'
import { StyledRow } from '../SearchResults/styled'
import { Faded, RecentBetween, StyledList, StyledRecent } from './styled'
import useDataStore from '../../../store/useDataStore'
import { ItemActionType, ListItemType } from '../SearchResults/types'
import { useVirtual } from 'react-virtual'
import { CategoryType } from '../../../store/Context/context.spotlight'

export type RecentType = { recents: Array<string>; onClearClick?: () => void }
export type RecentRowType = { text: string; highlight?: boolean; onClick: () => void; start: any }
export type RecentListType = { list: Array<ListItemType> }

export const RecentRow = forwardRef<HTMLDivElement, RecentRowType>((props, ref) => {
  return (
    // eslint-disable-next-line react/prop-types
    <StyledRow ref={ref} onClick={props.onClick} showColor={props.highlight} start={props.start}>
      {
        // eslint-disable-next-line react/prop-types
        props.text
      }
    </StyledRow>
  )
})

RecentRow.displayName = 'RecentRow'

export const RecentList: React.FC<RecentListType> = ({ list }) => {
  const history = useHistory()
  const { loadNode, loadNodeAndAppend } = useLoad()

  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)
  const savedEditorNode = useSpotlightEditorStore((state) => state.node)

  const [currentIndex, setCurrentIndex] = useState<number>(list.length)
  const reset = useSpotlightAppStore((state) => state.reset)
  const { isPreview, setIsPreview } = useSpotlightEditorStore(({ isPreview, setIsPreview }) => ({
    isPreview,
    setIsPreview
  }))

  // const listLength = useMemo(() => list.length, [list])

  useEffect(() => {
    setCurrentIndex(list.length)
    loadNode(savedEditorNode.nodeid)
  }, [reset])

  const loadContent = (id: string, content: NodeEditorContent) => {
    if (content) {
      loadNodeAndAppend(id, content)
    } else loadNode(id)
  }

  // const keyDown = useKeyPress('ArrowDown')
  // const keyUp = useKeyPress('ArrowUp')
  // const onEnter = useKeyPress('Enter')

  // useEffect(() => {
  //   if (keyUp) {
  //     setCurrentIndex((s) => {
  //       const newIndex = s - 1 < 0 ? listLength - 1 : s - 1
  //       const item = list[newIndex]
  //       loadContent(item.extras.nodeid, nodeContent)
  //       if (!isPreview) setIsPreview(true)

  //       return newIndex
  //     })
  //   }

  //   if (keyDown) {
  //     setCurrentIndex((s) => {
  //       const newIndex = s + 1 > listLength - 1 ? 0 : s + 1
  //       const item = list[newIndex]
  //       loadContent(item.extras.nodeid, nodeContent)
  //       if (!isPreview) setIsPreview(true)
  //       return newIndex
  //     })
  //   }

  //   if (onEnter) {
  //     const item = list[currentIndex]
  //     loadContent(item.extras.nodeid, nodeContent)
  //     history.replace('/new')
  //   }
  // }, [keyDown, keyUp, onEnter, isPreview])

  const containerRef = useRef(null)

  const virtualizer = useVirtual({
    size: list.length,
    parentRef: containerRef
  })

  return (
    <div ref={containerRef}>
      {virtualizer.virtualItems.map((v) => {
        const item = list[v.index]
        return (
          <RecentRow
            text={item.title}
            ref={v.measureRef}
            start={v.start}
            onClick={() => setCurrentIndex(v.index)}
            key={`RECENT_${item?.extras?.nodeid ?? v.index}`}
            highlight={currentIndex === v.index}
          />
        )
      })}
    </div>
  )
}

const Recent = () => {
  const recents = useRecentsStore((state) => state.lastOpened)
  const clearRecents = useRecentsStore((state) => state.clear)
  const ilinks = useDataStore((state) => state.ilinks)

  const onClearClick = () => {
    clearRecents()
    appNotifierWindow(IpcAction.CLEAR_RECENTS, AppType.SPOTLIGHT)
  }

  const anyRecents = recents.length > 0
  const recentList = recents.map((nodeid: string) => {
    const item = ilinks.find((link) => link.nodeid === nodeid)
    const listItem: ListItemType = {
      id: item?.nodeid,
      icon: item?.icon ?? 'gg:file-document',
      title: item?.path,
      description: '',
      category: CategoryType.quicklink,
      type: ItemActionType.ilink,
      extras: {
        nodeid: item?.nodeid,
        path: item?.path,
        new: false
      }
    }

    return listItem
  })

  return (
    <StyledList>
      {anyRecents && (
        <StyledRecent>
          <RecentBetween>
            <ActionTitle>RECENT</ActionTitle>
            {anyRecents && <Faded onClick={onClearClick}>clear</Faded>}
          </RecentBetween>
          <RecentList list={recentList || []} />
        </StyledRecent>
      )}
      {/* <Actions /> */}
    </StyledList>
  )
}

export default Recent
