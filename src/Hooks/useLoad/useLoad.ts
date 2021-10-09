import useDataStore from '../../Editor/Store/DataStore'
import { NodeProperties, useEditorStore } from '../../Editor/Store/EditorStore'
import { getContent } from '../../Editor/Store/helpers'
import { NodeEditorContent } from '../../Editor/Store/Types'

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)

  const getNode = (uid: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const respectiveLink = ilinks.find((i) => i.uid === uid)
    // console.log({ uid, ilinks, respectiveLink })

    const UID = respectiveLink?.uid ?? uid
    const text = respectiveLink?.text ?? uid

    return {
      title: text,
      id: text,
      uid: UID,
      key: UID
    }
  }

  const loadNode = (uid: string) => loadNodeEditor(getNode(uid))
  const loadNodeProps = (nodeProps: NodeProperties) => loadNodeEditor(nodeProps)

  const loadNodeAndAppend = async (uid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(uid)
    const nodeContent = await getContent(uid)

    loadNodeAndReplaceContent(nodeProps, [...nodeContent, ...content])
  }

  return { loadNode, loadNodeAndAppend, loadNodeProps }
}

export default useLoad
