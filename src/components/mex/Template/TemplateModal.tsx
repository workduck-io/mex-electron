import { useApi } from '@apis/useSaveApi'
import { defaultContent } from '@data/Defaults/baseData'
import EditorPreviewRenderer from '@editor/EditorPreviewRenderer'
import { useContentStore } from '@store/useContentStore'
import { Snippet, useSnippetStore } from '@store/useSnippetStore'
import { ButtonFields } from '@style/Form'
import { Title, LoadingButton } from '@workduck-io/mex-components'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import { InviteWrapper, InviteFormWrapper } from '../Mention/ShareModal.styles'
import { TemplateContainer } from './TemplateModal.style'
import SidebarList from '../Sidebar/SidebarList'
import { useLinks } from '@hooks/useLinks'
import useModalStore, { ModalsType } from '@store/useModalStore'

const TemplateModal = () => {
  const { getILinkFromNodeid, getTitleFromPath } = useLinks()
  const { toggleOpen, open, data: nodeid } = useModalStore()

  const node = getILinkFromNodeid(nodeid)
  const templates = useSnippetStore((state) => state.snippets).filter((item) => item?.template)
  const [currentTemplate, setCurrentTemplate] = useState<Snippet>()

  const getMetadata = useContentStore((store) => store.getMetadata)
  const getContent = useContentStore((store) => store.getContent)
  const { saveDataAPI } = useApi()

  useEffect(() => {
    const metadata = getMetadata(nodeid)
    if (metadata?.templateID) {
      setCurrentTemplate(templates.find((item) => item.id === metadata.templateID))
    } else {
      setCurrentTemplate(templates[0])
    }
  }, [nodeid])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSelectItem = (id: string) => {
    setCurrentTemplate(templates.find((item) => item.id === id))
  }

  const onSubmit = async () => {
    const content = getContent(nodeid)

    if (nodeid) {
      saveDataAPI(nodeid, content.content, undefined, undefined, currentTemplate.id)
      toast('Template Set!')
    }

    toggleOpen(ModalsType.template)
  }

  return (
    <Modal
      className="ModalContent"
      overlayClassName="ModalOverlay"
      onRequestClose={() => toggleOpen(ModalsType.template)}
      isOpen={open === ModalsType.template}
    >
      <InviteWrapper>
        {templates.length !== 0 ? (
          <>
            <Title>Set Template for {getTitleFromPath(node?.path)}</Title>
            <p>Auto fill new notes using template</p>
          </>
        ) : (
          <Title>No templates found</Title>
        )}
        <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
          {templates.length !== 0 && (
            <TemplateContainer>
              <SidebarList
                items={templates}
                onClick={onSelectItem}
                selectedItemId={currentTemplate?.id}
                noMargin
                showSearch
                searchPlaceholder="Filter Templates..."
                emptyMessage="No Templates Found"
              />
              <section>
                <EditorPreviewRenderer
                  noMouseEvents
                  content={currentTemplate?.content || defaultContent.content}
                  editorId={currentTemplate?.id}
                />
              </section>
            </TemplateContainer>
          )}
          <ButtonFields position="end">
            <LoadingButton
              loading={isSubmitting}
              alsoDisabled={
                errors?.templateID !== undefined ||
                errors?.nodeid !== undefined ||
                templates?.length === 0 ||
                templates?.indexOf(currentTemplate) === -1
              }
              type="submit"
              primary
              large
            >
              Set Template
            </LoadingButton>
          </ButtonFields>
        </InviteFormWrapper>
      </InviteWrapper>
    </Modal>
  )
}

export default TemplateModal
