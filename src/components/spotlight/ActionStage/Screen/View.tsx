import React from 'react'
import styled from 'styled-components'
import Row from './Row'
import Project from '../Project'

type ViewProps = {
  item: any
  onBack: () => void
  onNext: () => void
  onPrev: () => void
}

const StyledView = styled.section`
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  width: 100%;
  margin-top: 0.5rem;
  /* background: ${({ theme }) => theme.colors.background.modal}; */
`

const ViewInfo = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};

  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-right: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.colors.background.modal};
`

const ViewMeta = styled.div`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background.modal};
`

const View: React.FC<ViewProps> = ({ item, onBack, onNext, onPrev }) => {
  const viewInfos = item.filter((item) => item.type === 'title' || item.type === 'desc')
  const viewMeta = item.filter((item) => item.type !== 'title' && item.type !== 'desc')

  return (
    <StyledView>
      <ViewInfo>
        {viewInfos.map((item, index) => (
          <Project item={item} type={item.type} key={index} isView />
        ))}
        {/* <pre>{JSON.stringify(viewInfos, null, 2)}</pre>
        <pre>{JSON.stringify(item, null, 2)}</pre> */}
      </ViewInfo>
      <ViewMeta>
        <Row
          row={viewMeta}
          isView
          type="column"
          // onClick={() => {
          //   // mog('ROW')
          // }}
        />
      </ViewMeta>
    </StyledView>
  )
}

export default View
