import { client, useAuth } from '@workduck-io/dwindle'
import { apiURLs } from '../apis/routes'
import { WORKSPACE_HEADER } from '../data/Defaults/defaults'
import { USE_API } from '../data/Defaults/dev_'
import { useSaver } from '../editor/Components/Saver'
import useDataStore from '../store/useDataStore'
import { useLinks } from './useLinks'

import { useAuthStore } from '../services/auth/useAuth'

export const useBookmarks = () => {
  const setBookmarks = useDataStore((state) => state.setBookmarks)
  const getBookmarks = useDataStore((state) => state.getBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)
  const removeBookmarks = useDataStore((state) => state.removeBookamarks)
  const { onSave } = useSaver()
  const { userCred } = useAuth()
  const { getPathFromNodeid } = useLinks()

  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  const isBookmark = (nodeid: string) => {
    const bookmarks = useDataStore.getState().bookmarks
    return [...bookmarks].reverse().slice(0, 5).indexOf(nodeid) > -1
  }

  const addBookmark = async (nodeid: string): Promise<boolean> => {
    if (!USE_API) {
      addBookmarks([nodeid])
      return true
    }
    if (userCred) {
      return await client
        .post(
          apiURLs.bookmark(userCred.userId, nodeid),
          {
            type: 'BookmarkRequest'
          },
          {
            headers: {
              [WORKSPACE_HEADER]: workspaceDetails.id,
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        // .then(console.log)
        .then(() => {
          addBookmarks([nodeid])
        })
        .then(() => onSave())
        .then(() => {
          return true
        })
        .catch((e) => {
          console.log(e)
          return false
        })
    }
    return false
  }

  const getAllBookmarks = async () => {
    if (!USE_API) {
      return getBookmarks()
    }

    await client
      .get(apiURLs.getBookmarks(userCred.userId), {
        headers: {
          [WORKSPACE_HEADER]: workspaceDetails.id,
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        // console.log('Data', d.data)

        if (d.data) {
          const bookmarks = d.data.filter((nodeid: string) => getPathFromNodeid(nodeid) !== undefined)
          setBookmarks(bookmarks)
        }
        return d.data
      })
      .catch(console.error)
  }

  const removeBookmark = async (nodeid: string): Promise<boolean> => {
    if (!USE_API) {
      removeBookmarks([nodeid])
      return true
    }
    if (userCred) {
      const res = await client
        .patch(
          apiURLs.bookmark(userCred.userId, nodeid),
          {
            type: 'BookmarkRequest'
          },
          {
            headers: {
              [WORKSPACE_HEADER]: workspaceDetails.id,
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        // .then(console.log)
        .then(() => {
          removeBookmarks([nodeid])
        })
        .then(() => onSave())
        .then(() => {
          return true
        })
        .catch((e) => {
          console.log(e)
          return false
        })
      return res
    }
    return false
  }

  return { isBookmark, addBookmark, removeBookmark, getAllBookmarks }
}
