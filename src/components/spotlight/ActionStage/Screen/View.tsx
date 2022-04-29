import React from 'react'
import styled from 'styled-components'
import Row from './Row'
import Project from '../Project'
import { mog } from '../../../../utils/lib/helper'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'

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
  height: 90vh;
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

export const ViewPage = () => {
  const viewData = useSpotlightAppStore((store) => store.viewData)

  return <View item={viewData} />
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
