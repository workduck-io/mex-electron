import React, { useMemo } from 'react'
import { ActionSubType, useActionStore } from '../../Actions/useActionStore'
import ActionFormElement from './Fields/ActionFormElement'
import FormSelector from './FormSelector'
import { StyledActionFormContainer } from './styled'

export type ActionFormProps = {
  actionId: string
  actionGroupId: string
  subType: ActionSubType
}

const ActionForm: React.FC<ActionFormProps> = ({ subType, actionId, actionGroupId }) => {
  const groupedActions = useActionStore((store) => store.groupedActions)

  const form = useMemo(() => {
    const config = groupedActions?.[actionGroupId]?.[actionId]
    return config?.form
  }, [actionGroupId, actionId])

  if (!subType || subType === 'none') return <></>

  return (
    <StyledActionFormContainer narrow={false}>
      {form.map((element) => (
        <ActionFormElement key={element.key} element={element}>
          <FormSelector element={element} />
        </ActionFormElement>
      ))}
    </StyledActionFormContainer>
  )
}

export default ActionForm
