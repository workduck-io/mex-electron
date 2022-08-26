import searchLine from '@iconify/icons-ri/search-line'
import { useApi } from '@apis/useSaveApi'
import { defaultContent } from '@data/Defaults/baseData'
import EditorPreviewRenderer from '@editor/EditorPreviewRenderer'
import { debounce } from 'lodash'
import { Icon } from '@iconify/react'
import { Label } from '@radix-ui/react-context-menu'
import { useContentStore } from '@store/useContentStore'
import { useEditorStore } from '@store/useEditorStore'
import { Snippet, useSnippetStore } from '@store/useSnippetStore'
import { SelectWrapper, StyledCreatatbleSelect, ButtonFields, Input } from '@style/Form'
import { Title, LoadingButton } from '@workduck-io/mex-components'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import { InviteWrapper, InviteFormWrapper } from '../Mention/ShareModal.styles'
import { EmptyMessage, FilteredItemsWrapper, SidebarListFilter } from '../Sidebar/SidebarList.style'
import SnippetList from '../Sidebar/SnippetList'
import { TemplateContainer } from './TemplateModal.style'
import { TemplateModalData, useTemplateModalStore } from './TemplateModalStore'
import SidebarListItemComponent from '../Sidebar/SidebarListItem'
import { a } from 'react-spring'
import { ItemContent, ItemTitle } from '@style/Sidebar'
import SidebarList from '../Sidebar/SidebarList'
import { useLinks } from '@hooks/useLinks'

// interface PermissionModalContentProps { }

const TemplateModal = () => {
  const { getILinkFromNodeid } = useLinks()
  const open = useTemplateModalStore((store) => store.open)
  const closeModal = useTemplateModalStore((store) => store.closeModal)
  const nodeid = useTemplateModalStore((state) => state.data).nodeid

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
  } = useForm<TemplateModalData>()

  const onSelectItem = (id: string) => {
    setCurrentTemplate(templates.find((item) => item.id === id))
  }

  const onSubmit = async () => {
    const content = getContent(nodeid)

    if (nodeid) {
      saveDataAPI(nodeid, content.content, undefined, undefined, currentTemplate.id)
      toast('Template Set!')
    }

    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <InviteWrapper>
        {templates.length !== 0 ? (
          <>
            <Title>Set Template for {node?.path}</Title>
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
                errors.templateID !== undefined ||
                errors.nodeid !== undefined ||
                templates.length === 0 ||
                templates.indexOf(currentTemplate) === -1
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
