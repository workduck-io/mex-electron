import { mog } from '../utils/lib/helper'
import useDataStore from '../store/useDataStore'
import { AddILinkProps, ILink } from '../types/Types'
import toast from 'react-hot-toast'

// Used to ensure no path clashes while adding ILink.
// path functions to check wether clash is happening can be also used
export const useNodes = () => {
  const addILink = useDataStore((s) => s.addILink)

  const addNode = (props: AddILinkProps, onSuccess: (node: ILink) => void, showAlert = true) => {
    // mog('Adding Node for:', { props })
    try {
      const node = addILink({ ...props, showAlert })
      if (node) onSuccess(node)
    } catch (e) {
      mog('Error while creating node', { e })
      // if (e.startsWith('ERROR-RESERVED:'))
      if (showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

  const isInArchive = (nodeid: string): boolean => {
    const archive = useDataStore.getState().archive
    const res = archive.map((l) => l.nodeid).includes(nodeid)
    return res
  }

  return { addNode, isInArchive }
}
