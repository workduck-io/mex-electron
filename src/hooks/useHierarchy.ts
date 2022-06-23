import { useApi } from '@apis/useSaveApi'
import { generateNodeUID, HASH_SEPARATOR } from '@data/Defaults/idPrefixes'
import { mog } from '@utils/lib/helper'
import toast from 'react-hot-toast'
import { getNodeidFromPathAndLinks, useLinks } from './useLinks'
import { NodeEditorContent } from '../types/Types'
import { defaultContent } from '@data/Defaults/baseData'
import useDataStore from '@store/useDataStore'
import { useDataSaverFromContent } from '@editor/Components/Saver'
import { SEPARATOR } from '@components/mex/Sidebar/treeUtils'

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

const appendToText = (text: string, textToAppend: string, separator = SEPARATOR) => {
  if (!text) return textToAppend
  return `${text}${separator}${textToAppend}`
}

export const useHierarchy = () => {
  const { saveNewNodeAPI, bulkSaveNodes } = useApi()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  const createNoteHierarchyString = (notePath: string) => {
    const ilinks = useDataStore.getState().ilinks
    let prefix = ''

    const noteLink = notePath.split(SEPARATOR).reduce((prevPath, currentNotePath) => {
      prefix = appendToText(prefix, currentNotePath)

      const currentNoteId = getNodeidFromPathAndLinks(ilinks, prefix)
      const linkWithTitle = appendToText(prevPath, currentNotePath, HASH_SEPARATOR)
      const link = appendToText(linkWithTitle, currentNoteId, HASH_SEPARATOR)

      return link
    }, '')

    return noteLink
  }

  const addInHierarchy = async (options: {
    noteId: string
    notePath: string
    parentNoteId: string
    noteContent?: NodeEditorContent
  }) => {
    try {
      const { notePath, noteId, parentNoteId, noteContent } = options

      const content = noteContent ?? defaultContent.content
      const bulkNotePath = !parentNoteId ? createNoteHierarchyString(notePath) : notePath

      const node = parentNoteId
        ? await saveNewNodeAPI(noteId, {
            path: notePath,
            parentNoteId,
            content
          })
        : await bulkSaveNodes(noteId, {
            path: bulkNotePath,
            content
          })

      saveEditorValueAndUpdateStores(noteId, content)

      return node
    } catch (error) {
      mog('Error while creating node', { error })
    }
  }

  return {
    addInHierarchy
  }
}
