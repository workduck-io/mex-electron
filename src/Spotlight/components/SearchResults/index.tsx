/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React, { useEffect, useRef, useState } from 'react'
import { Action, ActionDesc, ActionDescStyled, ActionTitle, CreateMex } from '../Actions/styled'
import { StyledKey } from '../Shortcuts/styled'
import { StyledRow, StyledResults, Description } from './styled'
import CreateIcon from '@iconify-icons/ph/lightning'
import { useResultsShortcuts } from '../../../Spotlight/shortcuts/useResultsShortcuts'

export const Result: React.FC<{
  result: any
  onClick: () => void
  selected?: boolean
  key?: string
}> = ({ result, selected, onClick }) => {
  return (
    <StyledRow showColor={selected} onClick={onClick} key={`STRING_${result.key}`}>
      {result?.text}
      <Description>{result?.desc}</Description>
    </StyledRow>
  )
}

const SearchResults: React.FC<{ current: number; data: Array<any> }> = ({ current, data }) => {
  const ref = useRef<any>(undefined!)
  const [selectedIndex, setSelectedIndex] = useState<number>(current)
  useResultsShortcuts()

  useEffect(() => {
    ref?.current?.scrollToItem(current)
    setSelectedIndex(current)
  }, [current])

  return (
    <StyledResults>
      {data.length === 0 ? (
        <Action>
          <ActionTitle>ACTIONS</ActionTitle>
          <CreateMex showColor>
            <ActionDescStyled>
              <Icon style={{ marginRight: '5px' }} color="#888" height={20} width={20} icon={CreateIcon} />
              Create new Mex
            </ActionDescStyled>
            <StyledKey>TAB</StyledKey>
          </CreateMex>
        </Action>
      ) : (
        <ActionTitle>SEARCH RESULTS</ActionTitle>
      )}
      {data?.map((result, index) => (
        <Result
          key={`RESULT_${result?.text || String(index)}`}
          selected={index === selectedIndex}
          onClick={() => {
            setSelectedIndex(index)
          }}
          result={result}
        />
      ))}
    </StyledResults>
  )
}

export default SearchResults
