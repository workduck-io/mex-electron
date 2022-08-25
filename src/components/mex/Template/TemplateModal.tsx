import { useApi } from '@apis/useSaveApi'
import { Label } from '@radix-ui/react-context-menu'
import { useContentStore } from '@store/useContentStore'
import { useEditorStore } from '@store/useEditorStore'
import { useSnippetStore } from '@store/useSnippetStore'
import { SelectWrapper, StyledCreatatbleSelect, ButtonFields } from '@style/Form'
import { Title, LoadingButton } from '@workduck-io/mex-components'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import { InviteWrapper, InviteFormWrapper } from '../Mention/ShareModal.styles'
import { TemplateModalData, useTemplateModalStore } from './TemplateModalStore'

// interface PermissionModalContentProps { }

const TemplateModal = () => {
  const open = useTemplateModalStore((store) => store.open)
  const closeModal = useTemplateModalStore((store) => store.closeModal)

  const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((store) => store.getContent)
  const snippets = useSnippetStore((state) => state.snippets)
  const { saveDataAPI } = useApi()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<TemplateModalData>()

  const onSubmit = async (data) => {
    const nodeid = node?.nodeid
    const content = getContent(nodeid)

    if (nodeid) {
      saveDataAPI(nodeid, content.content, undefined, undefined, data.templateID.value)
      toast('Template Set!')
    }

    closeModal()
  }
  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <InviteWrapper>
        <Title>Set Template for Children</Title>
        <p>Auto fill new notes using template</p>
        <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
          <SelectWrapper>
            {/* TODO: Add a content preview as well, decide whether this should be a dropdown or something like a small snippets view */}
            <Label>Select Template</Label>
            <Controller
              control={control}
              render={({ field }) => (
                <StyledCreatatbleSelect
                  {...field}
                  defaultValue={'Select Template'}
                  // TODO: doing this outside of JSX would be cleaner
                  options={snippets
                    .filter((item) => item.template)
                    .map((item) => {
                      return { value: item.id, label: item.title }
                    })}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={true}
                />
              )}
              name="templateID"
            />
          </SelectWrapper>

          <ButtonFields>
            <LoadingButton
              loading={isSubmitting}
              alsoDisabled={errors.templateID !== undefined || errors.nodeid !== undefined}
              type="submit"
              primary
              large
            >
              Set
            </LoadingButton>
          </ButtonFields>
        </InviteFormWrapper>
      </InviteWrapper>
    </Modal>
  )
}

export default TemplateModal
