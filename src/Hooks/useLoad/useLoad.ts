import { useSaver } from '../../Editor/Components/Saver'
import { USE_API } from '../../Defaults/dev_'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useDataStore from '../../Editor/Store/DataStore'
import { NodeProperties, useEditorStore } from '../../Editor/Store/EditorStore'
import { getContent } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { useApi } from '../../Requests/Save'
import toast from 'react-hot-toast'
import { useGraphStore } from '../../Components/Graph/GraphStore'
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import { updateEmptyBlockTypes } from '../../Lib/helper'
import { convertContentToRawText } from '../../Search/localSearch'

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
  const { onSave } = useSaver()

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
    console.log(JSON.stringify(node), null, 2)

    const isDraftNode = node && node.key.startsWith('Draft.')

    return inIlinks || inArchive || isDraftNode
  }

  const loadNode = async (uid: string, options: LoadNodeProps = { savePrev: true, fetch: USE_API }) => {
    if (!options.node && !isLocalNode(uid)) {
      toast.error('Selected node does not exist.')
      uid = editorNodeId
    }

    setNodePreview(false)
    setSelectedNode(undefined)

    if (options.savePrev) onSave()

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
