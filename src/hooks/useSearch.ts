import { idxKey, SearchRepExtra } from '../types/search'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

import { useLinks } from './useLinks'
import useDataStore from '@store/useDataStore'
import { ELEMENT_ILINK } from '@editor/Components/ilink/defaults'
import { mog } from '@utils/lib/helper'
import { ELEMENT_INLINE_BLOCK } from '@editor/Components/InlineBlock/types'
import { useMentionStore } from '@store/useMentionStore'
import { ELEMENT_MENTION } from '@editor/Components/mentions/defaults'
import { useAuthStore } from '@services/auth/useAuth'

export const useSearchExtra = () => {
  const ilinks = useDataStore((s) => s.ilinks)
  const mentionable = useMentionStore((s) => s.mentionable)
  const invited = useMentionStore((s) => s.invitedUsers)
  const currentUserDetails = useAuthStore((s) => s.userDetails)

  const getSearchExtra = (): SearchRepExtra => {
    const ilink_rep = ilinks.reduce((p, ilink) => ({ ...p, [ilink.nodeid]: ilink.path }), {})

    const mention_rep = mentionable.reduce((p, mention) => ({ ...p, [mention.userID]: mention.alias }), {})
    const invited_rep = invited.reduce((p, invited) => ({ ...p, [invited.alias]: invited.alias }), {})
    const self_rep = { ...invited_rep, ...mention_rep, [currentUserDetails.userID]: currentUserDetails.alias }

    return {
      [ELEMENT_ILINK]: {
        // ILinks nodeids are in value
        keyToIndex: 'value',
        replacements: ilink_rep
      },
      [ELEMENT_INLINE_BLOCK]: {
        keyToIndex: 'value',
        replacements: ilink_rep
      },
      [ELEMENT_MENTION]: {
        keyToIndex: 'value',
        replacements: self_rep
      }
    }
  }

  return { getSearchExtra }
}

export const useSearch = () => {
  const { getPathFromNodeid } = useLinks()
  const { getSearchExtra } = useSearchExtra()

  const addDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    const extra = getSearchExtra()
    // mog('addDocument', { key, nodeId, contents, title, tags, extra })
    await ipcRenderer.invoke(
      IpcAction.ADD_DOCUMENT,
      key,
      nodeId,
      contents,
      title ?? getPathFromNodeid(nodeId),
      tags,
      extra
    )
  }

  const updateDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    const extra = getSearchExtra()
    // mog('updateDocument', { key, nodeId, contents, title, tags, extra })
    await ipcRenderer.invoke(
      IpcAction.UPDATE_DOCUMENT,
      key,
      nodeId,
      contents,
      title ?? getPathFromNodeid(nodeId),
      tags,
      extra
    )
  }

  const removeDocument = async (key: idxKey, id: string) => {
    await ipcRenderer.invoke(IpcAction.REMOVE_DOCUMENT, key, id)
  }

  const queryIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX, key, query, tags)
    return results
  }

  const queryIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX_BY_NODEID, key, nodeId, query)
    return results
  }

  const queryIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
    const results = await ipcRenderer.invoke(IpcAction.QUERY_INDEX_WITH_RANKING, key, query)
    return results
  }

  return { addDocument, updateDocument, removeDocument, queryIndex, queryIndexByNodeId, queryIndexWithRanking }
}
