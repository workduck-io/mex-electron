import React, { useEffect, useMemo, useRef } from 'react'

import { NestedFloating } from '@components/FloatingElements'
import { useBufferStore, useEditorBuffer } from '@hooks/useEditorBuffer'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import useMultipleEditors from '@store/useEditorsStore'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import { useLocation, useMatch } from 'react-router-dom'

import { Button, MexIcon } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'
import { Tooltip } from '@components/FloatingElements/Tooltip'
import { getNameFromPath } from '../../../components/mex/Sidebar/treeUtils'
import { TagsRelatedTiny } from '../../../components/mex/Tags/TagsRelated'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useTags } from '../../../hooks/useTags'
import { useContentStore } from '../../../store/useContentStore'
import { NodeEditorContent } from '../../../types/Types'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper,
  PreviewActionHeader
} from './EditorPreview.styles'
import { useTheme } from 'styled-components'
import { useNamespaces } from '@hooks/useNamespaces'
import NamespaceTag from '@components/mex/NamespaceTag'
import useRouteStore, { BannerType } from '@store/useRouteStore'
import useSocket from '@hooks/useSocket'
import { SocketActionType } from '../../../types/socket'
import Banner from '../Banner'
import { mog } from '@utils/lib/mog'

export interface EditorPreviewProps {
  nodeid: string
  blockId?: string
  children: React.ReactElement
  placement?: string
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  editable?: boolean
  label?: string
  content?: NodeEditorContent
  allowClosePreview?: boolean
  icon?: string
  iconTooltip?: string
  setPreview?: (open: boolean) => void
}

const EditorPreview = ({
  nodeid,
  blockId,
  allowClosePreview,
  children,
  content,
  hover,
  label,
  editable = true,
  setPreview,
  icon,
  iconTooltip,
  preview
}: EditorPreviewProps) => {
  const { getILinkFromNodeid } = useLinks()

  const { hasTags } = useTags()
  const editorContentFromStore = useContentStore((store) => store.contents?.[nodeid])
  const { loadNode, getNoteContent } = useLoad()
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()
  const { getNamespace } = useNamespaces()

  const cc = useMemo(() => {
    const nodeContent = getNoteContent(nodeid)

    const ccx = content ?? nodeContent
    return ccx
  }, [nodeid, editorContentFromStore])

  const ilink = getILinkFromNodeid(nodeid, true)

  const namespace = getNamespace(ilink?.namespace)

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

  const theme = useTheme()
  const showPreview = !checkIfAlreadyPresent(nodeid)

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
                    <PreviewActionHeader>
                      <EditorPreviewNoteName onClick={onClickNavigate}>
                        <Icon icon={ilink?.icon ?? fileList2Line} />
                        {getNameFromPath(ilink.path)}
                        {namespace && <NamespaceTag namespace={namespace} />}
                      </EditorPreviewNoteName>
                      {icon && iconTooltip && (
                        <Tooltip key={labelId} content={iconTooltip}>
                          <MexIcon color={theme.colors.gray[5]} noHover icon={icon} height="14" width="14" />
                        </Tooltip>
                      )}
                    </PreviewActionHeader>
                  )}
                  <PreviewActionHeader>
                    <TagsRelatedTiny nodeid={nodeid} />
                    <Button
                      transparent
                      onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        close()
                      }}
                    >
                      <Icon icon={closeCircleLine} />
                    </Button>
                  </PreviewActionHeader>
                </EditorPreviewControls>
              )}
              <EditablePreview
                editable={editable}
                onClose={close}
                id={nodeid}
                blockId={blockId}
                hover={hover}
                editorId={editorId}
                content={cc}
              />
            </EditorPreviewWrapper>
          )
        }
      >
        {children}
      </NestedFloating>
    )
  } else return children
}

const EditablePreview = ({ content, editable, editorId, id: nodeId, onClose, hover, blockId }: any) => {
  const addToBuffer = useBufferStore((store) => store.add)
  const removeEditor = useMultipleEditors((store) => store.removeEditor)
  const presentEditor = useMultipleEditors((store) => store.editors)?.[nodeId]
  const changeEditorState = useMultipleEditors((store) => store.changeEditorState)
  const lastOpenedEditorId = useMultipleEditors((store) => store.lastOpenedEditor)
  const removePreviousRouteInfo = useRouteStore((r) => r.removePreviousRouteInfo)
  const { saveAndClearBuffer } = useEditorBuffer()
  const fromSocket = useSocket()
  const location = useLocation()
  const ref = useRef()
  const routePath = `${ROUTE_PATHS.node}/${nodeId}`

  const removeRouteInfo = useRouteStore((r) => r.removeRouteInfo)
  const isBannerVisible = useRouteStore((r) => r.routes?.[routePath]?.banners?.includes(BannerType.editor))

  const onEditorClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (editable) {
      changeEditorState(nodeId, { editing: true })

      removePreviousRouteInfo()
      fromSocket.sendJsonMessage({
        action: SocketActionType.ROUTE_CHANGE,
        data: { route: routePath }
      })
    }

  }

  useEffect(() => {
    return () => {
      if (onClose) onClose()

      saveAndClearBuffer(false)
      removeEditor(nodeId)
      removeRouteInfo(routePath)
      fromSocket.sendJsonMessage({ action: SocketActionType.ROUTE_CHANGE, data: { route: location.pathname } })
    }
  }, [])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      KeyE: (e) => {
        const lastOpened = lastOpenedEditorId()
        if (editable && (nodeId === lastOpened?.nodeId || hover) && !lastOpened?.editorState?.editing) {
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

  const handleBannerButtonClick = () => {
    mog("handleBannerButtonClick")
  }

  return (
     <>
      {isBannerVisible && (
        <Banner
          route={routePath}
          onClick={handleBannerButtonClick}
          title="Same Note is being accessed by multiple users. Data may get lost!"
          withDetails={false}
        />
      )}
      <EditorPreviewEditorWrapper
        ref={ref}
        tabIndex={-1}
        id={editorId}
        blink={presentEditor?.blink}
        editable={!!presentEditor?.editing}
        onClick={(ev) => {
          ev.stopPropagation()

          if (ev.detail === 2) {
            onEditorClick(ev)
          }
        }}
      >
        <EditorPreviewRenderer
          onChange={onChange}
          content={content}
          blockId={blockId}
          draftView={false} // theres no draftView prop in the JSX element have to add it 
          readOnly={!editable || !presentEditor?.editing}
          editorId={editorId}
        />
      </EditorPreviewEditorWrapper>
    </>
  )
}

export default EditorPreview
