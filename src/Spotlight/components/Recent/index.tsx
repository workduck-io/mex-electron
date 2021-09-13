/* eslint-disable react/prop-types */
import React from 'react'
import { Action, ActionTitle } from '../Actions/styled'
import { Faded, RecentBetween, StyledRecent, StyledRecentRow, StyledRecentList } from './styled'

export type RecentType = { current: number; recents: Array<string>; onClearClick?: () => void }
export type RecentRowType = { text: string; highlight?: boolean }
export type RecentListType = { list: Array<string>; index: number }

export const RecentRow: React.FC<RecentRowType> = ({ text, highlight }) => {
  return <StyledRecentRow highlight={highlight}>{text}</StyledRecentRow>
}

export const RecentList: React.FC<RecentListType> = ({ list, index }) => {
  const revIndex = list.length - 1 - index

  return (
    <StyledRecentList>
      {list.map((item, i) => (
        <RecentRow text={item} key={`RECENT_${item}`} highlight={revIndex === i} />
      ))}
    </StyledRecentList>
  )
}

const Recent: React.FC<RecentType> = ({ current, recents, onClearClick }) => {
  const anyRecents = recents.length > 0
  return (
    <StyledRecent>
      <Action>
        <RecentBetween>
          <ActionTitle>RECENT</ActionTitle>
          {anyRecents && <Faded onClick={onClearClick}>CLEAR</Faded>}
        </RecentBetween>
      </Action>
      {!anyRecents ? <Faded>No recent mex here..</Faded> : <RecentList list={recents || []} index={current} />}
    </StyledRecent>
  )
}

export default Recent
