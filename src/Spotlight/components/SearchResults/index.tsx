/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React, { useEffect, useRef } from 'react'
import { FixedSizeList } from 'react-window'
import { Action, ActionDesc, ActionDescStyled, ActionTitle, CreateMex, FlexBetween } from '../Actions/styled'
import { StyledKey } from '../Shortcuts'
import { StyledRow, StyledResults, Heading, Description } from './styled'
import CreateIcon from '@iconify-icons/ph/lightning'

export const Result: React.FC<{
  result: any
  selected?: boolean
  key?: string
}> = ({ result, selected }) => {
  return (
    <StyledRow showColor={selected} key={`STRING_${result.key}`}>
      {result?.text}
      <Description>{result?.desc}</Description>
    </StyledRow>
  )
}

const SearchResults: React.FC<{ current: number; data: Array<any> }> = ({ current, data }) => {
  const ref = useRef<any>(undefined!)
  useEffect(() => {
    ref?.current?.scrollToItem(current)
  }, [current])

  return (
    <StyledResults>
      <Heading>Search Results</Heading>
      {data.length === 0 && (
        <>
          <ActionDesc>No search results found.</ActionDesc>
          <br />
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
        </>
      )}
      <FixedSizeList ref={ref} height={250} itemCount={data.length} itemSize={51} width={300}>
        {({ index }) => {
          const result = data[index]
          return <Result selected={index === current} result={result} />
        }}
      </FixedSizeList>
    </StyledResults>
  )
}

export default SearchResults
