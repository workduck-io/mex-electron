import React from 'react'
import { FormDataType, FormField } from '@workduck-io/action-request-helper'
import Selector from '../Performers/Selector'
import { useActionStore } from '../../Actions/useActionStore'
import ActionInput from './Fields/ActionInput'
import styled from 'styled-components'

export type FormSelectorProps = {
  element: FormField
}

export const ActionSelector = styled(Selector)`
  max-width: 40vh;
`

const FormSelector: React.FC<FormSelectorProps> = ({ element }) => {
  const activeAction = useActionStore((store) => store.activeAction)

  switch (element.type) {
    case FormDataType.SELECT:
      return (
        <Selector
          width="50%"
          placeholder={element.options.placeholder}
          actionGroupId={activeAction?.actionGroupId}
          actionId={element.actionId}
        />
      )
    case FormDataType.TEXT:
      return <ActionInput element={element} actionGroupId={activeAction?.actionGroupId} actionId={element.actionId} />
    case FormDataType.MULTI_SELECT:
      return (
        <Selector
          isMulti
          width="50%"
          placeholder={element.options.placeholder}
          actionGroupId={activeAction?.actionGroupId}
          actionId={element.actionId}
        />
      )
    default:
      return <div>Hello </div>
  }
}

export default FormSelector
