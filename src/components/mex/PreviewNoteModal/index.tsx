import React, { useEffect, useMemo } from 'react'

import { Tooltip } from '@components/FloatingElements/Tooltip'
import {
  EditorPreviewControls,
  EditorPreviewNoteName,
  PreviewActionHeader
} from '@editor/Components/EditorPreview/EditorPreview.styles'
import { sharedAccessIcon } from '@editor/Components/ilink/components/ILinkElement'
import Editor from '@editor/Editor'
import { useBufferStore, useEditorBuffer } from '@hooks/useEditorBuffer'
import { useLinks } from '@hooks/useLinks'
import { useNamespaces } from '@hooks/useNamespaces'
import { useNodes } from '@hooks/useNodes'
import { useTags } from '@hooks/useTags'
import { useTodoBuffer } from '@hooks/useTodoBuffer'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import { Icon } from '@iconify/react'
import { analyzeNote, useAnalysisStore } from '@store/useAnalysis'
import { useContentStore } from '@store/useContentStore'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { PlateProvider } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import Modal from 'react-modal'
import { useTheme } from 'styled-components'

import { Button, MexIcon } from '@workduck-io/mex-components'
import { NodeEditorContent } from '@workduck-io/mex-utils'

import { NodeType } from '../../../types/Types'
import NamespaceTag from '../NamespaceTag'
import { TagsRelatedTiny } from '../Tags/TagsRelated'
import { PreviewNoteContainer } from './styled'

const AnalyseBuffer = (noteId) => {
  const buffer = useBufferStore((store) => store.buffer)
  const analysis = useAnalysisStore((store) => store.analysis)
  const { addInBuffer } = useTodoBuffer()

  useEffect(() => {
    const { editorTodos, nodeid } = useAnalysisStore.getState().analysis
    mog('CHANGED TODOS', { editorTodos, nodeid })
    addInBuffer(nodeid, editorTodos)
  }, [analysis])

  useEffect(() => {
    analyzeNote(noteId)
  }, [buffer, noteId])

  return <></>
}

const PreviewNoteModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.previewNote)
  const modalData = useModalStore((store) => store.data)
  const toggleModal = useModalStore((store) => store.toggleOpen)
  const addValueInBuffer = useBufferStore((store) => store.add)

  const theme = useTheme()
  const { getNodeType, getSharedNode } = useNodes()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { flushTodosBuffer } = useTodoBuffer()
  const { getNamespace } = useNamespaces()
  const { hasTags } = useTags()
  const { getTitleFromNoteId, getILinkFromNodeid } = useLinks()

  const content = useMemo(() => {
    const data = useContentStore.getState().getContent(modalData?.noteId)?.content
    return data
  }, [modalData])

  const { noteTitle, noteLink } = useMemo(() => {
    return {
      noteTitle: getTitleFromNoteId(modalData?.noteId, { includeShared: true }),
      noteLink: getILinkFromNodeid(modalData?.noteId, true)
    }
  }, [modalData?.noteId])

  if (!isOpen) return <></>

  const onRequestClose = () => {

    flushTodosBuffer()
    saveAndClearBuffer(false)
    toggleModal(undefined)
  }

  const onChange = (val: NodeEditorContent) => {
    addValueInBuffer(modalData?.noteId, val)
  }

  const onClickNoteTitle = (ev) => {
    ev.preventDefault()
  }

  const nodeType = getNodeType(modalData?.noteId)
  const sharedNode = nodeType === NodeType.SHARED ? getSharedNode(modalData?.noteId) : undefined
  const namespace = getNamespace(noteLink.namespace)

  const iconTooltip = sharedNode?.currentUserAccess && `You have ${sharedNode?.currentUserAccess?.toLowerCase()} access`
  const icon = sharedAccessIcon[sharedNode?.currentUserAccess]

  return (
    <Modal
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <PlateProvider id={modalData?.noteId}>
        <PreviewNoteContainer>
          {/* <ModalHeader>{noteTitle}</ModalHeader> */}
          <AnalyseBuffer noteId={modalData?.noteId} />
          <EditorPreviewControls hasTags={hasTags(modalData?.noteId)}>
            {
              <PreviewActionHeader>
                <EditorPreviewNoteName onClick={onClickNoteTitle}>
                  <Icon icon={noteLink?.icon} />
                  {noteTitle}
                  {namespace && <NamespaceTag namespace={namespace} />}
                </EditorPreviewNoteName>
                {icon && iconTooltip && (
                  <Tooltip key="hello" content={iconTooltip}>
                    <MexIcon color={theme.colors.gray[5]} noHover icon={icon} height="14" width="14" />
                  </Tooltip>
                )}
              </PreviewActionHeader>
            }
            <PreviewActionHeader>
              <TagsRelatedTiny nodeid={modalData?.noteId} />
              <Button
                transparent
                onClick={(ev) => {
                  ev.preventDefault()
                  ev.stopPropagation()

                  onRequestClose()
                }}
              >
                <Icon icon={closeCircleLine} />
              </Button>
            </PreviewActionHeader>
          </EditorPreviewControls>
          <Editor
            content={content}
            onChange={onChange}
            autoFocus
            // blockId={modalData?.blockId}
            editorId={modalData?.noteId}
          />
        </PreviewNoteContainer>
      </PlateProvider>
    </Modal>
  )
}

export default PreviewNoteModal
