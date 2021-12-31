import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import toast from 'react-hot-toast'
import { useGraphStore } from '../../Components/Graph/GraphStore'
import { USE_API } from '../../Defaults/dev_'
import { useDataSaverFromContent } from '../../Editor/Components/Saver'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useDataStore from '../../Editor/Store/DataStore'
import { NodeProperties, useEditorStore } from '../../Editor/Store/EditorStore'
import { getContent } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { updateEmptyBlockTypes } from '../../Lib/helper'
import { useApi } from '../../Requests/Save'
import { useSaveQ } from '../useQ'

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
  const { getDataAPI } = useApi()
  const { saveNodeAPIandFs } = useDataSaverFromContent()
  const { q, saveQ } = useSaveQ()

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

    const isDraftNode = node && node.key.startsWith('Draft.')

    return inIlinks || inArchive || isDraftNode
  }

  // const saveDebouncedAPIfs = () => {
  // const oldNode = useEditorStore.getState().node
  // if (oldNode && oldNode.uid !== '__null__') saveNodeAPIandFs(oldNode.uid)
  // }

  const loadNode = async (uid: string, options: LoadNodeProps = { savePrev: true, fetch: USE_API() }) => {
    if (!options.node && !isLocalNode(uid)) {
      toast.error('Selected node does not exist.')
      uid = editorNodeId
    }

    setNodePreview(false)
    setSelectedNode(undefined)

    if (options.savePrev) {
      if (q.length > 0) saveQ()
      // saveDebouncedAPIfs()
    }

    const node = options.node ?? getNode(uid)

    loadNodeEditor(node)

    if (options.fetch) {
      setFetchingContent(true)
      getDataAPI(uid)
        .then((res) => {
          const { data, metadata } = res
          if (data) {
            updateEmptyBlockTypes(data, ELEMENT_PARAGRAPH)
            loadNodeAndReplaceContent(node, data)

            setContent(uid, data, metadata)
          }
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          setFetchingContent(false)
        })
    }
  }

  const loadNodeProps = (nodeProps: NodeProperties) => {
    loadNodeEditor(nodeProps)
  }

  const loadNodeAndAppend = async (uid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(uid)
    const nodeContent = getContent(uid)

    loadNodeAndReplaceContent(nodeProps, [...nodeContent, ...content])
  }

  return { loadNode, loadNodeAndAppend, loadNodeProps, getNode }
}

export default useLoad
