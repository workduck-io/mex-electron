import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useMemo, useRef } from 'react'
import { getNameFromPath } from '../../../components/mex/Sidebar/treeUtils'
import { TagsRelatedTiny } from '../../../components/mex/Tags/TagsRelated'
import { useLinks } from '../../../hooks/useLinks'
import { useTags } from '../../../hooks/useTags'
import { useContentStore } from '../../../store/useContentStore'
import { NodeEditorContent } from '../../../types/Types'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper,
  PreviewActionHeader
} from './EditorPreview.styles'
import useLoad from '../../../hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { Button } from '@workduck-io/mex-components'
import { NestedFloating } from '@components/FloatingElements'
import useMultipleEditors from '@store/useEditorsStore'
import { useBufferStore, useEditorBuffer } from '@hooks/useEditorBuffer'
import { useEditorStore } from '@store/useEditorStore'
import { mog } from '@utils/lib/helper'
import { useMatch, useParams } from 'react-router-dom'
import { tinykeys } from '@workduck-io/tinykeys'
import { focusEditor, getPlateEditorRef, selectEditor } from '@udecode/plate'

export interface EditorPreviewProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  label?: string
  content?: NodeEditorContent
  allowClosePreview?: boolean
  setPreview?: (open: boolean) => void
}

const EditorPreview = ({
  nodeid,
  allowClosePreview,
  children,
  content,
  hover,
  label,
  setPreview,
  preview
}: EditorPreviewProps) => {
  const { getILinkFromNodeid } = useLinks()

  const { hasTags } = useTags()
  const editorContentFromStore = useContentStore((store) => store.contents?.[nodeid])
  const { loadNode, getNoteContent } = useLoad()
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()

  const cc = useMemo(() => {
    const nodeContent = getNoteContent(nodeid)

    const ccx = content ?? nodeContent
    return ccx
  }, [nodeid, editorContentFromStore])

  const ilink = getILinkFromNodeid(nodeid)

  const editorId = `${nodeid}_Preview`

  const onClickNavigate = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const checkIfAlreadyPresent = (noteId: string) => {
    const params = match?.params
    const isPresent = useMultipleEditors.getState().editors?.[noteId]?.blink
    const isEditorNote = params?.nodeid === noteId

    return isPresent || isEditorNote
  }

  const showPreview = useMemo(() => !checkIfAlreadyPresent(nodeid), [nodeid, match])

  if (cc) {
    return (
      <NestedFloating
        hover={hover}
        label={label}
        persist={!allowClosePreview}
        open={preview}
        setOpen={setPreview}
        render={({ close, labelId }) =>
          showPreview && (
            <EditorPreviewWrapper id={labelId} className="__editor__preview" tabIndex={-1}>
              {(allowClosePreview || hasTags(nodeid) || ilink?.path) && (
                <EditorPreviewControls hasTags={hasTags(nodeid)}>
                  {ilink?.path && (
                    <EditorPreviewNoteName onClick={onClickNavigate}>
                      <Icon icon={ilink?.icon ?? fileList2Line} />
                      {getNameFromPath(ilink.path)}
                    </EditorPreviewNoteName>
                  )}
                  <PreviewActionHeader>
                    <TagsRelatedTiny nodeid={nodeid} />
                    <Button
                      transparent
                      onClick={() => {
                        close()
                      }}
                    >
                      <Icon icon={closeCircleLine} />
                    </Button>
                  </PreviewActionHeader>
                </EditorPreviewControls>
              )}
              <EditablePreview onClose={close} id={nodeid} editorId={editorId} content={cc} />
            </EditorPreviewWrapper>
          )
        }
      >
        {children}
      </NestedFloating>
    )
  } else return children
}

const EditablePreview = ({ content, editorId, id: nodeId, onClose }: any) => {
  const addToBuffer = useBufferStore((store) => store.add)
  const removeEditor = useMultipleEditors((store) => store.removeEditor)
  const presentEditor = useMultipleEditors((store) => store.editors)?.[nodeId]
  const changeEditorState = useMultipleEditors((store) => store.changeEditorState)
  const lastOpenedEditorId = useMultipleEditors((store) => store.lastOpenedEditor)

  const { saveAndClearBuffer } = useEditorBuffer()
  const ref = useRef()

  const onEditorClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    changeEditorState(nodeId, { editing: true })
  }

  useEffect(() => {
    return () => {
      if (onClose) onClose()

      saveAndClearBuffer(false)
      removeEditor(nodeId)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      KeyE: (e) => {
        const lastOpened = lastOpenedEditorId()
        if (nodeId === lastOpened?.nodeId && !lastOpened?.editorState?.editing) {
          onEditorClick(e)
          const editor = getPlateEditorRef(editorId)
          if (editor) selectEditor(editor, { edge: 'start', focus: true })
        } else {
          unsubscribe()
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const onChange = (val: NodeEditorContent) => {
    addToBuffer(nodeId, val)
  }

  return (
    <EditorPreviewEditorWrapper
      ref={ref}
      tabIndex={-1}
      id={nodeId}
      blink={presentEditor?.blink}
      editable={!!presentEditor?.editing}
      onClick={(ev) => {
        if (ev.detail === 2) {
          onEditorClick(ev)
        }
      }}
    >
      <EditorPreviewRenderer
        onChange={onChange}
        content={content}
        readOnly={!presentEditor?.editing}
        editorId={editorId}
      />
    </EditorPreviewEditorWrapper>
  )
}

export default EditorPreview
