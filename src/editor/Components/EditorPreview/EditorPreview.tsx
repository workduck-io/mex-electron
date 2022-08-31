import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useMemo } from 'react'
import { getNameFromPath } from '../../../components/mex/Sidebar/treeUtils'
import { TagsRelatedTiny } from '../../../components/mex/Tags/TagsRelated'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { useLinks } from '../../../hooks/useLinks'
import { useTags } from '../../../hooks/useTags'
import { useContentStore } from '../../../store/useContentStore'
import { NodeEditorContent } from '../../../types/Types'
import { mog } from '../../../utils/lib/helper'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper
} from './EditorPreview.styles'
import useLoad from '../../../hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { Button } from '@workduck-io/mex-components'
import { NestedFloating } from '@components/FloatingElements'
import useMultipleEditors from '@store/useEditorsStore'
import { useBufferStore, useEditorBuffer } from '@hooks/useEditorBuffer'
import { FloatingOverlay } from '@floating-ui/react-dom-interactions'
import { useComboboxStore } from '../combobox/useComboboxStore'

export interface EditorPreviewProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  content?: NodeEditorContent
  allowClosePreview?: boolean
  closePreview?: () => void
}

// export const LazyTippy = forwardRef(function LT(props: any, ref) {
//   const [mounted, setMounted] = useState(false)

//   const lazyPlugin = {
//     fn: () => ({
//       onMount: () => {
//         setMounted(true)
//       },
//       onHidden: () => {
//         setMounted(false)
//       }
//     })
//   }

//   const computedProps = { ...props }

//   computedProps.plugins = [lazyPlugin, ...(props.plugins || [])]

//   if (props.render) {
//     computedProps.render = (...args) => (mounted ? props.render(...args) : '')
//   } else {
//     computedProps.content = mounted ? props.content : ''
//   }

//   return <Tippy {...computedProps} ref={ref} />
// })

const EditorPreview = ({
  nodeid,
  allowClosePreview,
  children,
  content,
  hover,
  closePreview,
  preview
}: EditorPreviewProps) => {
  const { getILinkFromNodeid } = useLinks()

  const { hasTags } = useTags()
  const editorContentFromStore = useContentStore((store) => store.contents?.[nodeid])
  const { loadNode, getNoteContent } = useLoad()
  const { goTo } = useRouting()

  const cc = useMemo(() => {
    const nodeContent = getNoteContent(nodeid)

    const ccx = content ?? nodeContent
    return ccx
  }, [nodeid, editorContentFromStore])

  const ilink = getILinkFromNodeid(nodeid)

  const editorId = `__preview__${nodeid}}`

  const onClickNavigate = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    mog('OnClickNavigate', { e })
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const checkIfAlreadyPresent = (noteId: string) => {
    const isPresent = useMultipleEditors.getState().editors?.[noteId]?.blink
    return isPresent
  }

  const showPreview = !checkIfAlreadyPresent(nodeid) && preview

  if (cc) {
    return (
      <NestedFloating
        hover={hover}
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
                  <TagsRelatedTiny nodeid={nodeid} />
                  <Button
                    transparent
                    onClick={() => {
                      close()
                    }}
                  >
                    <Icon icon={closeCircleLine} />
                  </Button>
                </EditorPreviewControls>
              )}
              <EditablePreview onClose={closePreview} id={nodeid} editorId={editorId} content={cc} />
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
  const presentEditor = useMultipleEditors((store) => store.editors)[nodeId]
  const changeEditorState = useMultipleEditors((store) => store.changeEditorState)
  const { saveAndClearBuffer } = useEditorBuffer()

  const onEditorClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    changeEditorState(nodeId, { editing: true })
  }

  useEffect(() => {
    return () => {
      if (onClose) onClose()

      saveAndClearBuffer()
      removeEditor(nodeId)
    }
  }, [])

  const onChange = (val: NodeEditorContent) => {
    addToBuffer(nodeId, val)
  }

  return (
    <EditorPreviewEditorWrapper
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
