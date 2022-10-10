import React, { useEffect, useMemo, useState } from 'react'

import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { mog } from '@utils/lib/mog'
import { search as getSearchResults } from 'fast-fuzzy'
import styled from 'styled-components'

import { TemplateConfig } from '@workduck-io/action-request-helper'

import { useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import { useActionMenuStore } from '../ActionMenu/useActionMenuStore'
import List from './List'

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
  const getCacheResult = useActionsCache((store) => store.getCacheResult)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)

  const prevValue = getPreviousActionValue(actionId)?.selection
  const needsRefresh = useActionMenuStore((store) => store.needsRefresh)
  const setHideMenu = useActionMenuStore((store) => store.setHideMenu)
  const elementId = useActionStore((store) => store.element)?.id

  const isLoading = useActionStore((store) => store.isLoading)
  const { performer, isPerformer } = useActionPerformer()

  const view = useActionStore((store) => store.view)

  const search = useSpotlightContext()?.search

  useEffect(() => {
    const ready = isPerformer(actionId)

    if (ready) {
      performer(actionGroupId, actionId, { fetch: needsRefresh })
        .then((res) => {
          if (Array.isArray(res?.displayData)) {
            const displayData = res?.displayData as Array<TemplateConfig>
            setResData(displayData || [])
          }
        })
        .catch((err) => mog('error', { err }))
    }
  }, [actionId, prevValue, needsRefresh])

  const memoData = useMemo(() => {
    const result = getCacheResult(actionId, elementId)
    return result
  }, [actionId, elementId])

  useEffect(() => {
    const hideMenuOptions = !resData || resData?.length === 0
    setHideMenu(hideMenuOptions)
  }, [resData])

  useEffect(() => {
    if (search) {
      const data = (memoData?.displayData as TemplateConfig[]) ?? []

      const res = getSearchResults(search?.value, data, {
        keySelector: (obj: any) => obj.find((item) => item.type === 'title')?.value
      })

      setResData(search?.value ? res : data)
    }
  }, [search?.value, memoData])

  if (isLoading) null

  return (
    <StyledScreen>
      {!view && <List items={resData} context={getCacheResult(actionId, elementId)?.contextData ?? []} />}
    </StyledScreen>
  )
}

export default Screen
