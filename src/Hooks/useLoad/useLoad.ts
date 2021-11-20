import { useSaver } from '../../Editor/Components/Saver'
import { USE_API } from '../../Defaults/dev_'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useDataStore from '../../Editor/Store/DataStore'
import { NodeProperties, useEditorStore } from '../../Editor/Store/EditorStore'
import { getContent } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'
import { useApi } from '../../Requests/Save'

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)
  const setFetchingContent = useEditorStore((store) => store.setFetchingContent)
  const setContent = useContentStore((store) => store.setContent)
  const { getDataAPI } = useApi()
  const { onSave } = useSaver()

  const getNode = (uid: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const respectiveLink = ilinks.find((i) => i.uid === uid)

    const UID = respectiveLink?.uid ?? uid
    const text = respectiveLink?.text ?? uid

    const node = {
      title: text,
      id: text,
      uid: UID,
      key: text
    }

    return node
  }

  const loadNode = async (uid: string, savePrev = true) => {
    if (savePrev) onSave()
    const node = getNode(uid)
    loadNodeEditor(node)
    if (USE_API) {
      setFetchingContent(true)
      getDataAPI(uid)
        .then((res) => {
          const { data, metadata } = res
          if (data) {
            console.log('Data fetched and changed', data, metadata)
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
    const nodeContent = await getContent(uid)

    loadNodeAndReplaceContent(nodeProps, [...nodeContent, ...content])
  }

  return { loadNode, loadNodeAndAppend, loadNodeProps }
}

export default useLoad
