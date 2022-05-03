import React from 'react'
import styled, { css } from 'styled-components'
import Project from '../Project'
import { TemplateConfig } from '@workduck-io/action-request-helper'
import { transparentize } from 'polished'
import { ErrorBoundary } from 'react-error-boundary'
import { StyledBackground } from '../../styled'

type RowConatainerType = 'row' | 'column'

type RowContainerProps = {
  type: RowConatainerType
  active?: boolean
}

const RowContainer = styled.div<RowContainerProps>`
  /* width: 100%; */
  * {
    box-sizing: border-box;
  }

  display: flex;
  cursor: pointer;
  padding: 0.5rem;
  min-height: 2rem;
  margin: 0 0 0.5rem;
  align-items: ${(props) => (props.type === 'row' ? 'center' : 'inherit')};
  border-radius: 0.5rem;
  justify-content: space-between;
  flex-direction: ${(props) => (props.type === 'row' ? 'row' : 'column')};
  /* background-color: ${({ theme }) => transparentize(0.65, theme.colors.background.modal)}; */

  ${({ active }) =>
    active &&
    css`
      ${StyledBackground};
    `}

  :hover {
    ${StyledBackground}
  }
`

type RowProps = {
  row: TemplateConfig
  onClick?: () => void
  type?: RowConatainerType
  isView?: boolean
  active?: boolean
}

const Row: React.FC<RowProps> = ({ row, onClick, active, type = 'row', isView }) => {
  const handleOpenURL = () => {
    const url = row.find((item) => item.type === 'url')?.value as string

    // * Open result item in new tab
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <RowContainer active={active} type={type} onClick={onClick} onDoubleClick={handleOpenURL}>
      {row.map((item, index) => (
        <ErrorBoundary key={index} fallback={<></>}>
          <Project key={`PROJECT_${index}`} isView={isView} item={item} type={item?.type as any} />
        </ErrorBoundary>
      ))}
    </RowContainer>
  )
}

export default Row