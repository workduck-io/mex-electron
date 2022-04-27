import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mog } from '../../../../utils/lib/helper'
import { search as getSearchResults } from 'fast-fuzzy'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import { TemplateConfig } from '@workduck-io/action-request-helper'
import List from './List'
import View from './View'
import { useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'

const StyledScreen = styled.section`
  display: flex;
  border-radius: 1rem;
  justify-content: center;
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  margin: 0.25rem 0;
`

type ScreenProps = {
  actionGroupId: string
  actionId: string
}

export const isURL = (text: string) => {
  const pattern = '^(http|https|)://.*$'
  return text.match(pattern)
}

const Screen: React.FC<ScreenProps> = ({ actionGroupId, actionId }) => {
  const [resData, setResData] = useState<Array<TemplateConfig>>([])
  const getCacheResult = useActionStore((store) => store.getCacheResult)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)
  const prevValue = getPreviousActionValue(actionId)?.selection

  const isLoading = useSpotlightAppStore((store) => store.isLoading)
  const { performer, isPerformer } = useActionPerformer()
  const [activeIndex, setActiveIndex] = useState(-1)
  const view = useSpotlightAppStore((store) => store.view)
  const setView = useSpotlightAppStore((store) => store.setView)

  const { search } = useSpotlightContext()

  useEffect(() => {
    const ready = isPerformer(actionId)

    if (ready) {
      performer(actionGroupId, actionId)
        .then((res) => {
          if (Array.isArray(res?.displayData)) {
            const displayData = res?.displayData as Array<TemplateConfig>
            setResData(displayData || [])
          }
        })
        .catch((err) => mog('error', { err }))
    }
  }, [actionId, prevValue])

  useEffect(() => {
    const data = (getCacheResult(actionId)?.displayData as TemplateConfig[]) ?? []

    const res = getSearchResults(search?.value, data, {
      keySelector: (obj: any) => obj.find((item) => item.type === 'title')?.value
    })

    setResData(search?.value ? res : data)
  }, [search.value])

  if (isLoading) return null

  const onSelectItem = (index: any) => {
    setActiveIndex(index)
    setView('item')
  }

  const nextItem = () => {
    setActiveIndex((activeIndex + 1) % resData.length)
  }

  const prevItem = () => {
    setActiveIndex((activeIndex - 1 + resData.length) % resData.length)
  }

  const onBack = () => {
    setView(undefined)
  }

  return (
    <StyledScreen>
      {!view ? (
        <List items={resData} onSelect={onSelectItem} />
      ) : (
        <View item={resData[activeIndex]} onNext={nextItem} onPrev={prevItem} onBack={onBack} />
      )}
    </StyledScreen>
  )
}

export default Screen
