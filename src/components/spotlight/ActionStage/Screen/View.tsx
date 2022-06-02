import React, { useEffect } from 'react'
import styled from 'styled-components'
import Row from './Row'
import Project from '../Project'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionMenuStore } from '../ActionMenu/useActionMenuStore'

type ViewProps = {
  item: any
  onBack?: () => void
  onNext?: () => void
  onPrev?: () => void
}

const StyledView = styled.section`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 0.5rem;
  height: 100%;
  max-height: 90vh;
`

const ViewInfo = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  width: 45%;
  padding: ${({ theme }) => theme.spacing.small};

  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-right: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.colors.background.modal};
`

const ViewMeta = styled.div`
  flex: 1;
  width: 55%;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background.modal};
  overflow: hidden auto;
`

export const ViewPage: React.FC<{ context?: any }> = ({ context }) => {
  const viewData = useActionStore((store) => store.viewData)
  const setViewData = useActionStore((store) => store.setViewData)
  const needsRefresh = useActionMenuStore((store) => store.needsRefresh)
  const { performer } = useActionPerformer()

  useEffect(() => {
    if (context?.prevContext && context?.view) {
      performer(context?.actionGroupId, context?.actionId).then((res) => {
        if (res) setViewData({ context: res?.contextData, display: res?.displayData })
      })
    }
  }, [context, needsRefresh])

  return <View item={viewData?.display} />
}

const View: React.FC<ViewProps> = ({ item, onBack, onNext, onPrev }) => {
  if (!item) return null

  const viewInfos = item.filter((item) => item.type === 'title' || item.type === 'desc')
  const viewMeta = item.filter((item) => item.type !== 'title' && item.type !== 'desc')

  return (
    <StyledView>
      <ViewInfo>
        {viewInfos.map((item, index) => (
          <Project item={item} type={item.type} key={index} isView />
        ))}
      </ViewInfo>
      <ViewMeta>
        <Row row={viewMeta} isView type="column" />
      </ViewMeta>
    </StyledView>
  )
}

export default View
