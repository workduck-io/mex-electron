import React from 'react'

import { actionMenuStore, MenuProvider } from '@components/spotlight/ActionStage/ActionMenu/useActionMenuStore'
import { actionStore, Provider } from '@components/spotlight/Actions/useActionStore'
import styled, { css } from 'styled-components'

import { RootElement } from '../SyncBlock'
import ActionBlockContainer from './ActionBlock'

interface ActionBlockProps {
  attributes: any
  element: any
  children?: React.ReactElement | React.ReactElement[]
}

export const StyledActionBlock = styled.section<{ selected?: boolean }>`
  ${({ selected }) =>
    selected &&
    css`
      border: 1px solid ${({ theme }) => theme.colors.primary};
      background: none;

      padding: 0px;
      /* transform: translateY(-5px); */
    `}
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};
  overflow: hidden;
  position: relative;
`

const ActionBlock: React.FC<ActionBlockProps> = ({ attributes, element, children }) => {
  return (
    <RootElement {...attributes}>
      <Provider createStore={actionStore}>
        <MenuProvider createStore={actionMenuStore}>
          <ActionBlockContainer element={element} />
        </MenuProvider>
      </Provider>
      {children}
    </RootElement>
  )
}

export default ActionBlock
