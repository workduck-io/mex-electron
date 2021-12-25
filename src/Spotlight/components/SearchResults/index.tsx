/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { ActionTitle } from '../Actions/styled'
import { StyledRow, StyledResults, Description } from './styled'
import { useSpring, useTransition } from 'react-spring'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import ListenResultShortcut from './ListenResultShortcut'

export const Result: React.FC<{
  result: any
  onClick: () => void
  style: any
  selected?: boolean
  key?: string
}> = ({ result, selected, onClick, style }) => {
  return (
    <StyledRow style={style} showColor={selected} onClick={onClick} key={`STRING_${result.key}`}>
      {result?.text}
      <Description>{result?.desc}</Description>
    </StyledRow>
  )
}

const SearchResults: React.FC<{ current: number; data: Array<any> }> = ({ current, data }) => {
  const ref = useRef<any>(undefined!)

  const { search, editSearchedNode } = useSpotlightContext()
  const [selectedIndex, setSelectedIndex] = useState<number>(current)

  const props = useSpring({ width: search && !editSearchedNode ? '40%' : '0%', opacity: search ? 1 : 0 })

  const transitions = useTransition(data ?? [], {
    from: {
      marginTop: 0,
      opacity: 0,
      transform: 'translateY(-4px)'
    },
    enter: {
      marginTop: 0,
      opacity: 1,
      transform: 'translateY(0px)'
    },
    trail: 100
  })

  useEffect(() => {
    ref?.current?.scrollToItem(current)
    setSelectedIndex(current)
  }, [current])

  return (
    <StyledResults style={props} margin={search}>
      {data && data.length !== 0 && <ListenResultShortcut />}
      {data && <ActionTitle>SEARCH RESULTS</ActionTitle>}
      {data?.length === 0 && <ActionTitle>There's nothing with that name here...</ActionTitle>}
      {transitions((props, result, state, index) => {
        return (
          <Result
            style={{ ...props }}
            key={`RESULT_${result?.text || String(index)}`}
            selected={index === selectedIndex}
            onClick={() => {
              setSelectedIndex(index)
            }}
            result={result}
          />
        )
      })}
    </StyledResults>
  )
}

export default SearchResults
