import { getContent } from '../../Editor/Store/helpers'
import useDataStore from '../../Editor/Store/DataStore'
import { NodeProperties, useEditorStore } from '../../Editor/Store/EditorStore'
import { NodeEditorContent } from '../../Editor/Store/Types'

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)

  const getNode = (id: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const respectiveLink = ilinks.find((i) => i.key === id)
    console.log({ respectiveLink, ilinks })

    return {
      title: id,
      id,
      uid: respectiveLink.uid,
      key: id
    }
  }

  const loadNode = (id: string) => loadNodeEditor(getNode(id))
  const loadNodeProps = (nodeProps: NodeProperties) => loadNodeEditor(nodeProps)

  const loadNodeAndAppend = (id: string, content: NodeEditorContent) => {
    const nodeProps = getNode(id)
    const nodeContent = getContent(id)

    loadNodeAndReplaceContent(nodeProps, [...nodeContent, ...content])
  }

  return { loadNode, loadNodeAndAppend, loadNodeProps }
}

export default useLoad
