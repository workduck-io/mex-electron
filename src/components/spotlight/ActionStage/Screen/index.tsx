import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { mog } from '../../../../utils/lib/helper'
import { search as getSearchResults } from 'fast-fuzzy'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import { TemplateConfig } from '@workduck-io/action-request-helper'
import List from './List'
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

  const view = useSpotlightAppStore((store) => store.view)

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

  const memoData = useMemo(() => {
    return getCacheResult(actionId)
  }, [actionId])

  useEffect(() => {
    const data = (memoData?.displayData as TemplateConfig[]) ?? []

    const res = getSearchResults(search?.value, data, {
      keySelector: (obj: any) => obj.find((item) => item.type === 'title')?.value
    })

    setResData(search?.value ? res : data)
  }, [search.value, memoData])

  if (isLoading) return null

  return <StyledScreen>{!view && <List items={resData} context={memoData?.contextData ?? []} />}</StyledScreen>
}

export default Screen
