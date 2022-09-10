import React, { useEffect, useMemo } from 'react'

import { useGlobalListener } from '@hooks/useGlobalListener'
import useMultipleEditors from '@store/useEditorsStore'
import useSuggestionStore from '@store/useSuggestionStore'
import { getPlateEditorRef, Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import { debounce } from 'lodash'
import { useContextMenu } from 'react-contexify'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDebouncedCallback } from 'use-debounce'

import { useEditorChange } from '../hooks/useEditorActions'
import { useGraphStore } from '../store/useGraphStore'
import { EditorStyles } from '../style/Editor'
import { NodeEditorContent } from '../types/Types'
import { mog } from '../utils/lib/helper'
import { useBlockHighlightStore, useFocusBlock } from './Actions/useFocusBlock'
import BallonMarkToolbarButtons from './Components/EditorBalloonToolbar'
import { MENU_ID } from './Components/EditorContextMenu'
import { ComboboxOptions } from './Components/combobox/components/Combobox.types'
import components from './Components/components'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import generatePlugins, { PluginOptionType } from './Plugins/plugins'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
  comboboxOptions?: ComboboxOptions
  focusAtBeginning?: boolean
  showBalloonToolbar?: boolean
  onAutoSave?: (content: NodeEditorContent) => void
  padding?: string
  options?: PluginOptionType
  getSuggestions?: any
}

// High performance guaranteed
export const Editor = ({
  content,
  editorId,
  autoFocus = true,
  options,
  readOnly = false,
  onChange,
  onAutoSave,
  padding = '32px',
  focusAtBeginning = true,
  comboboxOptions = {
    showPreview: true
  },
  showBalloonToolbar = false,
  getSuggestions
}: EditorProps) => {
  const editableProps = {
    spellCheck: false,
    autoFocus,
    style: {
      padding
    },
    readOnly
  }

  const setNodePreview = useGraphStore((store) => store.setNodePreview)
  const headingQASearch = useSuggestionStore((store) => store.headingQASearch)
  const isEmpty = useMultipleEditors((store) => store.isEmpty)

  const editorRef = usePlateEditorRef()
  const { show } = useContextMenu({ id: MENU_ID })
  const { focusBlock } = useFocusBlock()
  const clearHighlights = useBlockHighlightStore((store) => store.clearAllHighlightedBlockIds)
  const hightlightedBlockIds = useBlockHighlightStore((store) => store.hightlighted.editor)

  useEffect(() => {
    const hightlightedBlockIds = useBlockHighlightStore.getState().hightlighted.editor
    if (editorRef && hightlightedBlockIds.length > 0) {
      focusBlock(hightlightedBlockIds[hightlightedBlockIds.length - 1], editorId)
      return
    }

    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'start', focus: true })
    }
  }, [editorRef, editorId, focusAtBeginning]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const tempRef = editorRef || getPlateEditorRef(editorId)

    if (tempRef && hightlightedBlockIds.length > 0) {
      focusBlock(hightlightedBlockIds[hightlightedBlockIds.length - 1], editorId)
      const clearHighlightTimeoutId = setTimeout(() => {
        if (!readOnly) clearHighlights()
      }, 2000)
      return () => clearTimeout(clearHighlightTimeoutId)
    }
  }, [hightlightedBlockIds, editorId, editorRef])

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId, options)

  const prePlugins = useMemo(() => generatePlugins(components, options), [])
  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (ev) => {
          show(ev)
        },
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  useEditorChange(editorId, content, onChange)

  const onDelayPerform = debounce(!readOnly && typeof onChange === 'function' ? onChange : () => undefined, 200)

  // * Get suggestions after 1.5 secs
  const getDebouncedSuggestions = useDebouncedCallback(
    typeof getSuggestions === 'function' ? getSuggestions : () => undefined,
    1500
  )

  const saveAfterDelay = useDebouncedCallback(
    typeof onAutoSave === 'function' ? onAutoSave : () => undefined,
    30 * 1000 // After 30 secons
  )

  const delayedHighlightRemoval = debounce(clearHighlights, 2000)

  const onChangeContent = (val: any[]) => {
    onDelayPerform(val)

    if (getSuggestions && !headingQASearch) {
      getDebouncedSuggestions.cancel()
      getDebouncedSuggestions(val)
    }

    if (onAutoSave) {
      saveAfterDelay.cancel()
      saveAfterDelay(val)
    }
  }

  return (
    <>
      <EditorStyles
        readOnly={readOnly}
        onClick={(ev) => {
          ev.stopPropagation()

          setNodePreview(false)
        }}
        data-tour="mex-onboarding-draft-editor"
      >
        <Plate
          id={editorId}
          editableProps={editableProps}
          initialValue={content}
          plugins={plugins}
          onChange={onChangeContent}
        >
          {showBalloonToolbar && <BallonMarkToolbarButtons />}
          {isEmpty && <MultiComboboxContainer options={comboboxOptions} config={comboConfigData} />}
          <GlobalEditorListener />
        </Plate>
      </EditorStyles>
    </>
  )
}

const withDndProvider = (Component: any) => {
  const DndDefaultEditor = (props: EditorProps) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
  )
  return DndDefaultEditor
}

const GlobalEditorListener = () => {
  useGlobalListener()
  return null
}

withDndProvider.displayName = 'DefaultEditor'

export default withDndProvider(Editor)
