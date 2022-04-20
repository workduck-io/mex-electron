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
  const actionToPerform = useActionStore((store) => store.actionToPerform)
  const getCachedAction = useActionStore((store) => store.getCachedAction)
  const selectedValue = useActionStore((store) => store.selectedValue)

  const isLoading = useSpotlightAppStore((store) => store.isLoading)
  const { performer, isReady } = useActionPerformer()
  const [activeIndex, setActiveIndex] = useState(-1)
  const view = useSpotlightAppStore((store) => store.view)
  const setView = useSpotlightAppStore((store) => store.setView)

  const { search } = useSpotlightContext()

  useEffect(() => {
    const ready = isReady()

    if (ready) {
      performer(actionGroupId, actionId)
        .then((res) => {
          if (Array.isArray(res.displayData)) {
            const data = (res?.displayData as TemplateConfig[]) ?? []
            setResData(data)
          }
        })
        .catch((err) => mog('error', { err }))
    }
  }, [actionId, actionToPerform, selectedValue])

  useEffect(() => {
    const data = (getCachedAction(actionId)?.data?.displayData as TemplateConfig[]) ?? []

    const res = getSearchResults(search?.value, data, {
      keySelector: (obj: any) => obj.find((item) => item.type === 'title')?.value
    })

    setResData(search?.value ? res : data)
  }, [search.value])

  if (isLoading) return null

  // return (
  //   <StyledScreen>
  //     <Loading transparent dots={5} />
  //   </StyledScreen>
  // )

  const onSelectItem = (index: any) => {
    setActiveIndex(index)
    setView(true)
  }

  const nextItem = () => {
    setActiveIndex((activeIndex + 1) % resData.length)
  }

  const prevItem = () => {
    setActiveIndex((activeIndex - 1 + resData.length) % resData.length)
  }

  const onBack = () => {
    setView(false)
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
