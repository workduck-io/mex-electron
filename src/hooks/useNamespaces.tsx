import useDataStore from '@store/useDataStore'
import { ILink, SingleNamespace } from '../types/Types'

export const useNamespaces = () => {
  const getNamespace = (id: string): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const namespace = namespaces.find((ns) => ns.id === id)
    if (namespace) return namespace
  }

  const getNodesOfNamespace = (id: string): ILink[] => {
    const ilinks = useDataStore.getState().ilinks
    return ilinks.filter((l) => l.namespace === id)
  }

  return { getNamespace, getNodesOfNamespace }
}
