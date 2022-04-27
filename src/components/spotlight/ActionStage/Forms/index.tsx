import React, { useMemo } from 'react'
import { FormData } from '@workduck-io/action-request-helper'
import { ActionSubType, useActionStore } from '../../Actions/useActionStore'
import ActionFormElement from './Fields/ActionFormElement'
import FormSelector from './FormSelector'
import { groupBy } from 'lodash'
import { ActionRow, StyledActionFormContainer } from './styled'
import { ServiceIcon } from '../../../../editor/Components/SyncBlock/SyncIcons'
import styled, { css, useTheme } from 'styled-components'
import { FullWidth } from '../Screen/List'
import { FormProvider, useForm } from 'react-hook-form'
import { mog } from '../../../../utils/lib/helper'
import { Button } from '../../../../style/Buttons'
import { useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { useActionPerformer } from '../../Actions/useActionPerformer'

export type ActionFormProps = {
  actionId: string
  actionGroupId: string
  subType: ActionSubType
}

const groupRows = (data: FormData) => {
  return groupBy(data, (n) => n.options.row)
}

type ActionRowRendererProps = {
  row: FormData
}

const ActionRowRenderer: React.FC<ActionRowRendererProps> = ({ row }) => {
  return (
    <ActionRow isRow={true}>
      {row.map((element) => (
        <ActionFormElement
          required={element.options.required}
          key={element.key}
          flex={element.options.flex}
          label={element.label}
        >
          <FormSelector element={element} />
        </ActionFormElement>
      ))}
    </ActionRow>
  )
}

const UniAction = styled(FullWidth)`
  display: flex;
  /* justify-content: space-evenly; */
  width: 100%;
  align-items: center;
`

const JoinService = styled.span<{ left?: boolean }>`
  display: flex;
  flex: 1;
  ${({ left }) =>
    left
      ? css`
          left: 4rem;
        `
      : css`
          right: 4rem;
        `}
  justify-content: center;
`

const Connector = styled.span`
  display: flex;
  padding: 0.25rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  /* background-color: ${(props) => props.theme.colors.divider}; */
  /* border-radius: ${(props) => props.theme.borderRadius.tiny}; */
`

const FloatingGroup = styled.div`
  border-radius: ${(props) => props.theme.borderRadius.small};
  border: none;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
`

const ActionForm: React.FC<ActionFormProps> = ({ subType, actionId, actionGroupId }) => {
  const groupedActions = useActionStore((store) => store.groupedActions)
  const activeAction = useActionStore((store) => store.activeAction)
  const { activeItem } = useSpotlightContext()
  const formMethods = useForm()
  const { performer } = useActionPerformer()
  const theme = useTheme()

  const form = useMemo(() => {
    const config = groupedActions?.[actionGroupId]?.[actionId]
    const groups = groupRows(config?.form ?? [])
    return groups
  }, [actionGroupId, actionId])

  if (!subType || subType === 'none') return <></>

  const filterFormData = (form: Record<string, any>) => {
    if (!form) return undefined
    const filteredForm = {}

    Object.entries(({ key, value }) => {
      if (value) {
        if (typeof value === 'string') filteredForm[key] = value
        else if (Array.isArray(value)) {
          const res = value.map((item) => (typeof item === 'string' ? item : item.label))
          filteredForm[key] = res
        } else if (typeof value === 'object') {
          filteredForm[key] = value.label
        }
      }
    })

    return filteredForm
  }

  const onSubmit = async (form: any) => {
    const res = await performer(actionGroupId, actionId, { formData: form })
    mog('RESULT OF POST', { res })
  }

  return (
    <UniAction narrow={false}>
      {/* <JoinService left>
        <ServiceIcon service="SLACK" height="5rem" width="5rem" />
        <Connector />
      </JoinService> */}
      <FormProvider {...formMethods}>
        <StyledActionFormContainer narrow={!!activeAction.actionIds}>
          {Object.values(form).map((row, index) => {
            return <ActionRowRenderer key={index} row={row} />
          })}
        </StyledActionFormContainer>
        <FloatingGroup>
          <Button type="submit" color={theme.colors.primary} onClick={formMethods.handleSubmit(onSubmit)}>
            {activeItem?.item?.title}
          </Button>
        </FloatingGroup>
      </FormProvider>
      <JoinService>
        <Connector />
        <ServiceIcon service="GITHUB" height="5rem" width="5rem" />
      </JoinService>
    </UniAction>
  )
}

export default ActionForm
