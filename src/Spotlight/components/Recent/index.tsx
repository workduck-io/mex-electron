import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { appNotifierWindow } from '../../../Spotlight/utils/notifiers'
import { AppType } from '../../../Data/useInitialize'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useKeyPress } from '../../../Spotlight/utils/hooks'
import { Action, ActionTitle } from '../Actions/styled'
import { Faded, RecentBetween, StyledRecent, StyledRecentRow, StyledRecentList } from './styled'
import { IpcAction } from '../../utils/constants'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { ipcRenderer } from 'electron'
import { NodeEditorContent } from '../../../Editor/Store/Types'

export type RecentType = { recents: Array<string>; onClearClick?: () => void }
export type RecentRowType = { text: string; highlight?: boolean; onClick: () => void }
export type RecentListType = { list: Array<string> }

export const RecentRow: React.FC<RecentRowType> = ({ text, highlight, onClick }) => {
  return (
    <StyledRecentRow onClick={onClick} highlight={highlight}>
      {text}
    </StyledRecentRow>
  )
}

export const RecentList: React.FC<RecentListType> = ({ list }) => {
  const keyDown = useKeyPress('ArrowDown')
  const keyUp = useKeyPress('ArrowUp')
  const onEnter = useKeyPress('Enter')

  const history = useHistory()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)
  const loadNodeAndAppend = useEditorStore((state) => state.loadNodeAndAppend)

  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)
  const savedEditorId = useSpotlightEditorStore((state) => state.nodeId)

  const [currentIndex, setCurrentIndex] = useState<number>(list.length)
  const [reset, setReset] = useState<boolean>(false)

  const { isPreview, setIsPreview } = useSpotlightEditorStore(({ isPreview, setIsPreview }) => ({
    isPreview,
    setIsPreview
  }))

  const listLength = useMemo(() => list.length, [list])

  useEffect(() => {
    ipcRenderer.on(IpcAction.SPOTLIGHT_BLURRED, () => {
      setReset((s) => !s)
    })
  }, [])

  useEffect(() => {
    setCurrentIndex(list.length)
    loadNodeFromId(savedEditorId)
  }, [reset])

  const loadContent = (id: string, content: NodeEditorContent) => {
    if (content) {
      loadNodeAndAppend(id, content)
    } else loadNodeFromId(id)
  }

  useEffect(() => {
    if (keyDown) {
      setCurrentIndex((s) => {
        const newIndex = s - 1 < 0 ? listLength - 1 : s - 1
        const id = list[newIndex]
        loadContent(id, nodeContent)
        if (!isPreview) setIsPreview(true)

        return newIndex
      })
    }

    if (keyUp) {
      setCurrentIndex((s) => {
        const newIndex = s + 1 > listLength - 1 ? 0 : s + 1
        const id = list[newIndex]
        loadContent(id, nodeContent)
        if (!isPreview) setIsPreview(true)
        return newIndex
      })
    }
    if (onEnter) {
      const id = list[currentIndex]
      loadContent(id, nodeContent)
      history.replace('/new')
    }
  }, [keyDown, keyUp, onEnter, isPreview])

  return (
    <StyledRecentList>
      {list.map((item, i) => (
        <RecentRow
          text={item}
          onClick={() => setCurrentIndex(i)}
          key={`RECENT_${item}`}
          highlight={currentIndex === i}
        />
      ))}
    </StyledRecentList>
  )
}

const Recent = () => {
  const recents = useRecentsStore((state) => state.lastOpened)
  const clearRecents = useRecentsStore((state) => state.clear)

  const onClearClick = () => {
    clearRecents()
    appNotifierWindow(IpcAction.CLEAR_RECENTS, AppType.SPOTLIGHT)
  }
  const anyRecents = recents.length > 0
  return (
    <StyledRecent>
      <Action>
        <RecentBetween>
          <ActionTitle>RECENT</ActionTitle>
          {anyRecents && <Faded onClick={onClearClick}>CLEAR</Faded>}
        </RecentBetween>
      </Action>
      {!anyRecents ? <Faded>No recent mex here..</Faded> : <RecentList list={recents || []} />}
    </StyledRecent>
  )
}

export default Recent
