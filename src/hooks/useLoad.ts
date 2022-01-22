import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import toast from 'react-hot-toast'
import { useApi } from '../apis/useSaveApi'
import { USE_API } from '../data/Defaults/dev_'
import { useDataSaverFromContent } from '../editor/Components/Saver'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { NodeProperties, useEditorStore } from '../store/useEditorStore'
import { useGraphStore } from '../store/useGraphStore'
import { useSaveQ, useQStore } from '../store/useQStore'
import { NodeEditorContent } from '../types/Types'
import { getContent } from '../utils/helpers'
import { mog, updateEmptyBlockTypes } from '../utils/lib/helper'
import { useEditorBuffer } from './useEditorBuffer'

export interface LoadNodeOptions {
  savePrev?: boolean
  fetch?: boolean
  node?: NodeProperties
  withLoading?: boolean
}

export type LoadNodeFn = (uid: string, options?: LoadNodeOptions) => void

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)
  const setFetchingContent = useEditorStore((store) => store.setFetchingContent)
  const setContent = useContentStore((store) => store.setContent)
  const editorNodeId = useEditorStore((state) => state.node.uid)
  const setNodePreview = useGraphStore((store) => store.setNodePreview)
  const setSelectedNode = useGraphStore((store) => store.setSelectedNode)
  const { getDataAPI, saveDataAPI } = useApi()
  const { saveNodeAPIandFs } = useDataSaverFromContent()
  const { saveAndClearBuffer } = useEditorBuffer()
  // const { saveQ } = useSaveQ()

  const getNode = (uid: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const archiveLink = archive.find((i) => i.uid === uid)
    const respectiveLink = ilinks.find((i) => i.uid === uid)

    const UID = respectiveLink?.uid ?? archiveLink?.uid ?? uid
    const text = respectiveLink?.text ?? archiveLink?.uid ?? uid

    const node = {
      title: text,
      id: text,
      uid: UID,
      key: text
    }

    return node
  }

  const isLocalNode = (uid: string) => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const node = getNode(uid)

    const inIlinks = ilinks.find((i) => i.uid === uid)
    const inArchive = archive.find((i) => i.uid === uid)

    const isDraftNode = node && node.key?.startsWith('Draft.')

    return inIlinks || inArchive || isDraftNode
  }

  /*
   * Saves content of a node to api and then uses
   * the response to update the content from server in local state
   */
  const saveApiAndUpdate = (node: NodeProperties, content: NodeEditorContent) => {
    setFetchingContent(true)
    saveDataAPI(node.uid, content)
      .then((data) => {
        if (data) {
          // const { data, metadata, version } = res

          mog('SAVED DATA', { data })
          // if (data) {
          //   updateEmptyBlockTypes(data, ELEMENT_PARAGRAPH)
          //   const nodeContent = {
          //     type: 'editor',
          //     content: data,
          //     version,
          //     metadata
          //   }
          // loadNodeAndReplaceContent(node, nodeContent)
          //   setContent(node.uid, data, metadata)
          // setFetchingContent(false)
          // }
        }
      })
      .catch(console.error)
      .finally(() => setFetchingContent(false))
  }

  /*
   * Fetches the node and saves it to local state
   * Should be used when current editor content is irrelevant to the node
   */
  const fetchAndSaveNode = (node: NodeProperties, withLoading = true) => {
    // console.log('Fetch and save', { node })
    // const node = getNode(uid)
    if (withLoading) setFetchingContent(true)
    getDataAPI(node.uid)
      .then((res) => {
        if (res) {
          // console.log(res)
          const { data, metadata, version } = res

          if (data) {
            updateEmptyBlockTypes(data, ELEMENT_PARAGRAPH)
            const nodeContent = {
              type: 'editor',
              content: data,
              version,
              metadata
            }
            loadNodeAndReplaceContent(node, nodeContent)
            // getPlateStore(`StandardEditor_${node.uid}`).set.value(data)
            // console.log({ nodeContent, data, res })
            // const editorId = getEditorId(node.uid, version, false)
            // getPlateStore(editorId).set.editableProps({ readOnly: false })
            // getPlateStore(editorId).set.resetEditor()
            setContent(node.uid, data, metadata)
            if (withLoading) setFetchingContent(false)
          }
        }
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        if (withLoading) setFetchingContent(false)
      })
  }

  // const saveDebouncedAPIfs = () => {
  // const oldNode = useEditorStore.getState().node
  // if (oldNode && oldNode.uid !== '__null__') saveNodeAPIandFs(oldNode.uid)
  // }

  /**
   * Loads a node in the editor.
   * This does not navigate to editor.
   */
  const loadNode: LoadNodeFn = (uid, options = { savePrev: true, fetch: USE_API(), withLoading: true }) => {
    // console.log('Loading Node', { uid, options })
    const hasBeenLoaded = false
    if (!options.node && !isLocalNode(uid)) {
      toast.error('Selected node does not exist.')
      uid = editorNodeId
    }

    setNodePreview(false)
    setSelectedNode(undefined)

    // const q = useQStore.getState().q
    if (options.savePrev) {
      // if (q.includes(uid)) {
      //   hasBeenLoaded = true
      // }
      saveAndClearBuffer()
      // if (q.length > 0) {
      // saveQ()
      // }
    }

    const node = options.node ?? getNode(uid)

    if (options.fetch && !hasBeenLoaded) {
      fetchAndSaveNode(node, options.withLoading)
    }

    loadNodeEditor(node)
  }

  const loadNodeProps = (nodeProps: NodeProperties) => {
    loadNodeEditor(nodeProps)
  }

  const loadNodeAndAppend = async (uid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(uid)
    const nodeContent = getContent(uid)

    loadNodeAndReplaceContent(nodeProps, { ...nodeContent, content: [...nodeContent.content, ...content] })
  }

  return { loadNode, fetchAndSaveNode, loadNodeAndAppend, loadNodeProps, getNode, saveApiAndUpdate }
}

export default useLoad
