import { useSuggestions } from '@components/mex/Suggestions/useSuggestions'
import { selectEditor, useFloatingTree, usePlateEditorRef } from '@udecode/plate'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { tinykeys } from '@workduck-io/tinykeys'
import shallow from 'zustand/shallow'
import Metadata from '../components/mex/Metadata/Metadata'
import { defaultContent } from '../data/Defaults/baseData'
import { useEditorBuffer } from '../hooks/useEditorBuffer'
import useLayout from '../hooks/useLayout'
import useLoad from '../hooks/useLoad'
import { useKeyListener } from '../hooks/useShortcutListener'
import { useAnalysisTodoAutoUpdate } from '../store/useAnalysis'
import useBlockStore from '../store/useBlockStore'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { useLayoutStore } from '../store/useLayoutStore'
import useRouteStore, { BannerType } from '@store/useRouteStore'
import { EditorWrapper, StyledEditor } from '../style/Editor'
import { getEditorId } from '../utils/lib/EditorId'
import BlockInfoBar from './Components/Blocks/BlockInfoBar'
import { useComboboxOpen } from './Components/combobox/hooks/useComboboxOpen'
import { BlockOptionsMenu } from './Components/EditorContextMenu'
import { default as Editor } from './Editor'
import Toolbar from './Toolbar'
import { useNodes } from '@hooks/useNodes'
import { useApi } from '@apis/useSaveApi'
import { getContent } from '@utils/helpers'
import { areEqual } from '@utils/lib/hash'
import toast from 'react-hot-toast'
import { useLastOpened } from '@hooks/useLastOpened'
import NavBreadCrumbs from '@components/mex/NavBreadcrumbs'
import { useContentStore } from '@store/useContentStore'
import { NavigationType,ROUTE_PATHS,useRouting } from '@views/routes/urls'
import { useLocation, useParams } from 'react-router-dom'
import Banner from './Components/Banner'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()
  const { accessWhenShared } = useNodes()

  const { getDataAPI } = useApi()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const isComboOpen = useComboboxOpen()

  const infobar = useLayoutStore((store) => store.infobar)

  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const { debouncedAddLastOpened } = useLastOpened()

  const { addOrUpdateValBuffer, getBufferVal, saveAndClearBuffer } = useEditorBuffer()
  const { node } = useEditorStore((state) => ({ nodeid: state.node.nodeid, node: state.node }), shallow)
  const location = useLocation()
  const nodeid = useParams()?.nodeId
  const fsContent = useContentStore((state) => state.contents[node.nodeid])

  const isBannerVisible = useRouteStore((s) =>
  s.routes?.[`${ROUTE_PATHS.node}/${nodeid}`]?.banners?.includes(BannerType.editor)
)

  const { goTo } = useRouting()
  const { shortcutHandler } = useKeyListener()
  const { getSuggestions } = useSuggestions()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const editorRef = usePlateEditorRef()

  const nodeContent = useMemo(() => {
    if (fsContent?.content) return fsContent.content
    return defaultContent.content
  }, [node.nodeid, fsContent])

  const onChangeSave = useCallback(
    async (val: any[]) => {
      if (val && node && node.nodeid !== '__null__') {
        addOrUpdateValBuffer(node.nodeid, val)
        debouncedAddLastOpened(node.nodeid)
      }
    },
    [node.nodeid]
  )

  const onAutoSave = useCallback((val) => {
    saveAndClearBuffer(false)
  }, [])

  const editorId = useMemo(() => getEditorId(node.nodeid, false), [node, fetchingContent])

  const onFocusClick = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    if (editorRef) {
      if (editorWrapperRef.current) {
        const el = editorWrapperRef.current
        const hasScrolled = el.scrollTop > 0
        // mog('ElScroll', { hasScrolled })
        if (!hasScrolled) {
          selectEditor(editorRef, { focus: true })
        }
      }
    }
  }

  useAnalysisTodoAutoUpdate()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode()
        })
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          const node = useEditorStore.getState().node
          const val = getBufferVal(node.nodeid)
          const content = getContent(node.nodeid)
          const res = areEqual(content.content, val)

          if (!res) {
            saveApiAndUpdate(node, val)
          } else {
            // * If buffer hasn't changed, refresh the note
            getDataAPI(node.nodeid, false, true)
          }
        })
      },
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          saveAndClearBuffer()
          toast('Saved!')
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const viewOnly = accessWhenShared(node.nodeid) === 'READ'
  // const readOnly = !!fetchingContent

  // mog('ContentEditor', { node, fsContent, nodeContent })
  const handleBannerButtonClick = (e) => {
    goTo(ROUTE_PATHS.namespaceShare, NavigationType.replace, 'NODE_ID_OF_SHARED_NODE') // have to create new route namespaceShare in the ROUTE_PATHS
  }
  return (
    <>
      <StyledEditor showGraph={infobar.mode === 'graph'} className="mex_editor">
        {isBannerVisible && (
            <Banner
              route={location.pathname}
              onClick={handleBannerButtonClick}
              title="Same Note is being accessed by multiple users. Data may get lost!"
            />
          )}
        <NavBreadCrumbs nodeId={node.nodeid} />
        <Toolbar />

        {isBlockMode ? <BlockInfoBar /> : <Metadata node={node} />}

        <EditorWrapper comboboxOpen={isComboOpen} isUserEditing={isUserEditing} ref={editorWrapperRef} onClick={onFocusClick}>
          <Editor
            showBalloonToolbar
            onAutoSave={onAutoSave}
            getSuggestions={getSuggestions}
            onChange={onChangeSave}
            content={nodeContent?.length ? nodeContent : defaultContent.content}
            editorId={editorId}
            readOnly={viewOnly}
          />
        </EditorWrapper>
      </StyledEditor>
      <BlockOptionsMenu blockId="one" />
      {/* <NodeIntentsModal nodeid={nodeid} /> */}
    </>
  )
}

export default ContentEditor
