/* eslint-disable react/prop-types */
import PlusCircle from '@iconify-icons/bi/plus-circle'
import Document from '@iconify-icons/gg/file-document'
import { Icon } from '@iconify/react'
import React, { useEffect, useRef, useState } from 'react'
import { useSpring, useTransition } from 'react-spring'
import { mog } from '../../../utils/lib/helper'
import { useTheme } from 'styled-components'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import useDataStore from '../../../store/useDataStore'
import { NoWrap, PrimaryText } from '../../../style/Integration'
import { ActionTitle } from '../Actions/styled'
import ListenResultShortcut from './ListenResultShortcut'
import { Description, StyledResults, StyledRow } from './styled'

export const Result: React.FC<{
  result: any // FIXME
  onClick: () => void
  style: any
  selected?: boolean
  key?: string
}> = ({ result, selected, onClick, style }) => {
  const theme = useTheme()
  return (
    <StyledRow style={style} showColor={selected} onClick={onClick} key={`STRING_${result.text}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon color={theme.colors.primary} style={{ marginRight: '8px' }} height={16} width={16} icon={Document} />
        <div>{result?.path}</div>
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

  const props = useSpring({ width: search ? '40%' : '0%', display: 'block', opacity: search ? 1 : 0 })

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
    const nodeid = addILink(search)
    setNode(getNode(nodeid))
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.SPOTLIGHT, search)
    setNormalMode(false)
  }

  const withNew = data?.length > 0 && data[0].new

  mog('', { search, data })

  return (
    <StyledResults style={props} margin={search}>
      {data && data.length !== 0 && <ListenResultShortcut />}
      {transitions((props, result, state, index) => {
        if (result.new) {
          return (
            <StyledRow showColor={index === selectedIndex} onClick={handleCreateItem} key="wd-mex-create-new-node">
              <NoWrap>
                <Icon style={{ marginRight: '8px' }} height={16} width={16} icon={PlusCircle} />
                <div>
                  Create new <PrimaryText>{search}</PrimaryText>
                </div>
              </NoWrap>
            </StyledRow>
          )
        }
        return (
          <>
            {((withNew && index === 1) || (!withNew && index === 0)) && <ActionTitle>SEARCH RESULTS</ActionTitle>}
            <Result
              style={{ ...props }}
              key={`RESULT_${result?.desc || String(index)}`}
              selected={index === selectedIndex}
              onClick={() => {
                setSelectedIndex(index)
              }}
              result={result}
            />
          </>
        )
      })}
      {data?.length === 0 && <ActionTitle>There&apos;s nothing with that name here...</ActionTitle>}
    </StyledResults>
  )
}

export default SearchResults
