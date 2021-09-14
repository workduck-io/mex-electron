/* eslint-disable react/prop-types */
import { replaceIDs } from '@iconify/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useKeyPress } from '../../../Spotlight/utils/hooks'
import { Action, ActionTitle } from '../Actions/styled'
import { Faded, RecentBetween, StyledRecent, StyledRecentRow, StyledRecentList } from './styled'

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

  const [currentIndex, setCurrentIndex] = useState<number>(list.length - 1)

  const listLength = useMemo(() => list.length, [list])

  useEffect(() => {
    if (keyDown) setCurrentIndex((s) => (s - 1 < 0 ? listLength - 1 : s - 1))
    if (keyUp) setCurrentIndex((s) => (s + 1 > listLength - 1 ? 0 : s + 1))
    if (onEnter) {
      loadNodeFromId(list[currentIndex])
      history.replace('/new')
    }
  }, [keyDown, keyUp, onEnter])

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

const Recent: React.FC<RecentType> = ({ recents, onClearClick }) => {
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
