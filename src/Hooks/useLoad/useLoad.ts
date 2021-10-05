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
    console.log({ uid, ilinks, respectiveLink })

    return {
      title: respectiveLink.text,
      id: respectiveLink.text,
      uid: respectiveLink.uid,
      key: uid
    }
  }

  const loadNode = (uid: string) => loadNodeEditor(getNode(uid))
  const loadNodeProps = (nodeProps: NodeProperties) => loadNodeEditor(nodeProps)

  const loadNodeAndAppend = (uid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(uid)
    const nodeContent = getContent(uid)

    loadNodeAndReplaceContent(nodeProps, [...nodeContent, ...content])
  }

  return { loadNode, loadNodeAndAppend, loadNodeProps }
}

export default useLoad
