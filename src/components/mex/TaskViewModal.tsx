import { useForm } from 'react-hook-form'
import React from 'react'
import Modal from 'react-modal'
import create from 'zustand'
import { Button } from '@style/Buttons'
import { mog } from '@utils/lib/helper'
import { ModalControls, ModalHeader } from './Refactor/styles'
import { SearchFilter } from '@hooks/useFilters'
import { Label, TextAreaBlock } from '@style/Form'
import { LoadingButton } from './Buttons/LoadingButton'
import Input, { InputFormError } from './Forms/Input'
import { useViewStore } from '@hooks/useTaskViews'
import { SearchFilterCount, SearchFilterListCurrent, SearchFilterStyled } from '@style/Search'
import { Icon } from '@iconify/react'
import stackLine from '@iconify/icons-ri/stack-line';
import { generateTaskViewId } from '@data/Defaults/idPrefixes'

// Prefill modal has been added to the Tree via withRefactor from useRefactor

interface TaskViewModalState {
  open: boolean
  // If present, changes will be applied to the view with viewid
  viewid?: string
  filters: SearchFilter<any>[]
  openModal: (filters: SearchFilter<any>[], viewid?: string) => void
  closeModal: () => void
}

export const useTaskViewModalStore = create<TaskViewModalState>((set) => ({
  open: false,
  filters: [],
  viewid: undefined,
  openModal: (filters, viewid) =>
    set({
      open: true,
      filters,
      viewid
    }),
  closeModal: () => {
    set({
      open: false,
      filters: [],
      viewid: undefined
    })
  }
}))

interface TaskViewModalFormData {
  title: string
  description: string
}

const TaskViewModal = () => {
  const open = useTaskViewModalStore((store) => store.open)
  const viewid = useTaskViewModalStore((store) => store.viewid)
  const filters = useTaskViewModalStore((store) => store.filters)

  const openModal = useTaskViewModalStore((store) => store.openModal)
  const closeModal = useTaskViewModalStore((store) => store.closeModal)

  const addView = useViewStore((store) => store.addView)

  const {
    // control,
    reset,
    register,
    // setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<TaskViewModalFormData>()

  const onSubmit = async (data: TaskViewModalFormData) => {
    mog('onSubmit', { data, filters, viewid })
    const view = {
      title: data.title,
      description: data.description,
      filters: filters,
      id: viewid ?? generateTaskViewId()
    }
    addView(view)
    reset()
    closeModal()
  }

  const handleCancel = () => {
    reset()
    closeModal()
  }

  // mog('TaskViewModal', { open })
  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>{viewid ? 'Update ' : 'New '}Task View</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="title"
          label="Title"
          inputProps={{
            autoFocus: true,
            ...register('title', {
              required: true
            })
          }}
          transparent={false}
        ></Input>

        <Label htmlFor="description">Description </Label>
        <TextAreaBlock placeholder="Ex. Bugs of development" {...register('description')} />

        <Label htmlFor="description">Filters </Label>
        {filters?.length > 0 && (
          <SearchFilterListCurrent>
            {filters.map((f) => (
              <SearchFilterStyled selected key={`current_f_${f.id}`}>
                {f.icon ? <Icon icon={f.icon} /> : null}
                {f.label}
                {f.count && <SearchFilterCount>{f.count}</SearchFilterCount>}
              </SearchFilterStyled>
            ))}
          </SearchFilterListCurrent>
        )}

        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={filters?.length === 0}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            {viewid ? 'Update' : 'Create'} View
          </LoadingButton>
        </ModalControls>
      </form>
    </Modal>
  )
}

export default TaskViewModal
