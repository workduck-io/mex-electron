/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { ActionTitle } from '../Actions/styled'
import PlusCircle from '@iconify-icons/bi/plus-circle'
import { StyledRow, StyledResults, Description } from './styled'
import { useSpring, useTransition } from 'react-spring'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import Document from '@iconify-icons/gg/file-document'
import ListenResultShortcut from './ListenResultShortcut'
import { useSpotlightAppStore } from '../../../Spotlight/store/app'
import { PrimaryText, Flex, NoWrap } from '../../../Styled/Integration'
import { Icon } from '@iconify/react'
import { useTheme } from 'styled-components'
import { AppType } from '../../../Data/useInitialize'
import { IpcAction } from '../../../Spotlight/utils/constants'
import { appNotifierWindow } from '../../../Spotlight/utils/notifiers'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import useLoad from '../../../Hooks/useLoad/useLoad'
import useDataStore from '../../../Editor/Store/DataStore'

export const Result: React.FC<{
  result: any
  onClick: () => void
  style: any
  selected?: boolean
  key?: string
}> = ({ result, selected, onClick, style }) => {
  const theme = useTheme()
  return (
    <StyledRow style={style} showColor={selected} onClick={onClick} key={`STRING_${result.key}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon color={theme.colors.primary} style={{ marginRight: '8px' }} height={16} width={16} icon={Document} />
        <div>{result?.text}</div>
      </div>
      <Description>{result?.desc}</Description>
    </StyledRow>
  )
}

const SearchResults: React.FC<{ current: number; data: Array<any> }> = ({ current, data }) => {
  const ref = useRef<any>(undefined!)

  const { search } = useSpotlightContext()
  const [selectedIndex, setSelectedIndex] = useState<number>(current)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const { addILink } = useDataStore()
  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  const setNode = useSpotlightEditorStore((s) => s.setNode)
  const { getNode } = useLoad()

  const props = useSpring({ width: search && normalMode ? '40%' : '0%', opacity: search ? 1 : 0 })

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

  const handleCreateItem = () => {
    const uid = addILink(search)
    setNode(getNode(uid))
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, search)
    setNormalMode(false)
  }

  return (
    <StyledResults style={props} margin={search}>
      {data && data.length !== 0 && <ListenResultShortcut />}
      {transitions((props, result, state, index) => {
        if (result.new) {
          return (
            <>
              <StyledRow showColor={index === selectedIndex} onClick={handleCreateItem} key="wd-mex-create-new-node">
                <NoWrap>
                  <Icon style={{ marginRight: '8px' }} height={16} width={16} icon={PlusCircle} />
                  <div>
                    Create new <PrimaryText>{search}</PrimaryText>
                  </div>
                </NoWrap>
              </StyledRow>
              <ActionTitle>SEARCH RESULTS</ActionTitle>
            </>
          )
        }
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
      {data?.length === 1 && <ActionTitle>There&apos;s nothing with that name here...</ActionTitle>}
    </StyledResults>
  )
}

export default SearchResults
