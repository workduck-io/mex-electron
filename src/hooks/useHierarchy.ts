import { useApi } from '@apis/useSaveApi'
import { generateNodeUID } from '@data/Defaults/idPrefixes'
import useTodoStore from '@store/useTodoStore'
import { getTodosFromContent } from '@utils/lib/content'
import { mog } from '@utils/lib/helper'
import toast from 'react-hot-toast'
import { useLinks } from './useLinks'
import { useSearch } from './useSearch'
import { useTags } from './useTags'
import { NodeEditorContent } from '../types/Types'
import { defaultContent } from '@data/Defaults/baseData'
import useDataStore from '@store/useDataStore'

export type ILink = {
  nodeid: string
  path: string
}

export type NewILinkProps = {
  openedNotePath?: string
  content?: NodeEditorContent
  showAlert?: boolean
}

export const hierarchyParser = (linkData: string[]): ILink[] => {
  const ilinks: ILink[] = []
  const idPathMapping: { [key: string]: string } = {}
  const pathIdMapping: { [key: string]: { nodeid: string; index: number } } = {}

  for (const subTree of linkData) {
    const nodes = subTree.split('#')
    let prefix: string

    if (nodes.length % 2 !== 0) throw new Error('Invalid Linkdata Input')

    for (let index = 0; index < nodes.length; index += 2) {
      const nodeTitle = nodes[index]
      const nodeID = nodes[index + 1]

      const nodePath = prefix ? `${prefix}.${nodeTitle}` : nodeTitle

      /*
          Drafts.A and Drafts.B exist, we need to check if the Drafts parent node is the same by checking
          the parent nodeUID. This handles the case in which a nodeID might have two different node paths. 
 
          We still do not handle the case where there are 2 nodes with the same path but different Node IDs,
          we handle that on the frontend for now
        */

      if (idPathMapping[nodeID]) {
        if (idPathMapping[nodeID] !== nodePath) throw new Error('Invalid Linkdata Input')
      } else if (pathIdMapping[nodePath]) {
        mog(`Found existing notePath: ${nodePath} with ${nodeID} at index: ${pathIdMapping[nodePath].index}`)
        ilinks[pathIdMapping[nodePath].index] = { nodeid: nodeID, path: nodePath }
      } else {
        mog(`Inserting: ${nodePath} with ${nodeID} at index: ${ilinks.length}`)
        idPathMapping[nodeID] = nodePath
        pathIdMapping[nodePath] = { nodeid: nodeID, index: ilinks.length }
        ilinks.push({ nodeid: nodeID, path: nodePath })
      }

      prefix = nodePath
    }
  }

  return ilinks
}

export const useHierarchy = () => {
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink } = useLinks()
  const { saveNewNodeAPI, bulkSaveNodes } = useApi()

  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { updateDocument } = useSearch()

  const addInHierachy = async (notePath, options?: NewILinkProps) => {
    try {
      const uniqueNotePath = checkValidILink({
        notePath,
        openedNotePath: options?.openedNotePath,
        showAlert: false
      })

      mog('Unique note path', { uniqueNotePath, options, notePath })

      const noteId = generateNodeUID()
      const content = options?.content ?? defaultContent.content
      const parentNoteLink = getParentILink(uniqueNotePath)

      mog('UNIQUE', { uniqueNotePath, parentNoteLink, notePath })

      const node = parentNoteLink?.nodeid
        ? await saveNewNodeAPI(noteId, {
            path: uniqueNotePath,
            parentNoteId: parentNoteLink.nodeid,
            content
          })
        : await bulkSaveNodes(noteId, {
            path: uniqueNotePath,
            content
          })

      if (content) {
        updateLinksFromContent(noteId, content)
        updateTagsFromContent(noteId, content)
        updateNodeTodos(noteId, getTodosFromContent(content))

        await updateDocument('node', noteId, content)
      }

      return node
    } catch (error) {
      mog('Error while creating node', { error })
      if (options?.showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

  return {
    addInHierachy
  }
}
