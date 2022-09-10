import { useApi } from '@apis/useSaveApi'
import useDataStore from '@store/useDataStore'
import { getNewNamespaceName, RESERVED_NAMESPACES } from '@utils/lib/paths'
import { mog } from '@workduck-io/mex-utils'
import { ILink, SingleNamespace } from '../types/Types'

export const useNamespaces = () => {
  const { createNewNamespace } = useApi()
  const addNamespace = useDataStore((s) => s.addNamespace)

  const getNamespace = (id: string): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const namespace = namespaces.find((ns) => ns.id === id)
    if (namespace) return namespace
  }

  const getNodesOfNamespace = (id: string): ILink[] => {
    const ilinks = useDataStore.getState().ilinks
    return ilinks.filter((l) => l.namespace === id)
  }

  const getDefaultNamespace = (): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const namespace = namespaces.find((ns) => ns.name === RESERVED_NAMESPACES.default)
    return namespace
  }

  const getDefaultNamespaceId = (): string | undefined => {
    const namespace = getDefaultNamespace()
    return namespace?.id
  }

  const addDefaultNewNamespace = async () => {
    const namespaces = useDataStore.getState().namespaces
    const newNamespaceName = getNewNamespaceName(namespaces.length)
    return await addNewNamespace(newNamespaceName)
  }

  const addNewNamespace = async (name: string) => {
    const ns = await createNewNamespace(name)
    if (ns) addNamespace(ns)

    mog('New namespace created', { ns })
    return ns
  }

  const getNodesByNamespaces = () => {
    const ilinks = useDataStore.getState().ilinks
    const namespaces = useDataStore.getState().namespaces
    const nodesByNamespace = namespaces.map((ns) => ({ ...ns, nodes: ilinks.filter((l) => l.namespace === ns.id) }))
    return nodesByNamespace
  }

  const getNamespaceOfNodeid = (nodeid: string): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const ilinks = useDataStore.getState().ilinks
    const namespace = ilinks.find((l) => l.nodeid === nodeid)?.namespace
    if (namespace) {
      const ns = namespaces.find((ns) => ns.id === namespace)
      return ns
    }
  }

  return {
    getNamespace,
    getNodesOfNamespace,
    getDefaultNamespace,
    getDefaultNamespaceId,
    addNewNamespace,
    getNamespaceOfNodeid,
    getNodesByNamespaces,
    addDefaultNewNamespace
  }
}
