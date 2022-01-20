import { getPlateEditorRef, getPlateStore, usePlateStore } from '@udecode/plate'
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import toast from 'react-hot-toast'
import { extractMetadata } from '../../Lib/metadata'
import { useGraphStore } from '../../Components/Graph/GraphStore'
import { USE_API } from '../../Defaults/dev_'
import { useDataSaverFromContent } from '../../Editor/Components/Saver'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useDataStore from '../../Editor/Store/DataStore'
import { NodeProperties, useEditorStore } from '../../Editor/Store/EditorStore'
import { getContent } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { mog, updateEmptyBlockTypes } from '../../Lib/helper'
import { useApi } from '../../Requests/Save'
import { useQStore, useSaveQ } from '../useQ'

type LoadNodeProps = {
  savePrev?: boolean
  fetch?: boolean
  node?: NodeProperties
}

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
  const { saveQ } = useSaveQ()

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
  const fetchAndSaveNode = (node: NodeProperties) => {
    // console.log('Fetch and save', { node })
    // const node = getNode(uid)
    setFetchingContent(true)
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
            setFetchingContent(false)
          }
        }
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setFetchingContent(false)
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
  const loadNode = async (uid: string, options: LoadNodeProps = { savePrev: true, fetch: USE_API() }) => {
    // console.log('Loading Node', { uid, options })
    let hasBeenLoaded = false
    if (!options.node && !isLocalNode(uid)) {
      toast.error('Selected node does not exist.')
      uid = editorNodeId
    }

    setNodePreview(false)
    setSelectedNode(undefined)

    const q = useQStore.getState().q
    if (options.savePrev) {
      if (q.includes(uid)) {
        hasBeenLoaded = true
      }
      if (q.length > 0) {
        saveQ()
      }
    }

    const node = options.node ?? getNode(uid)

    loadNodeEditor(node)

    if (options.fetch && !hasBeenLoaded) {
      fetchAndSaveNode(node)
    }
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
