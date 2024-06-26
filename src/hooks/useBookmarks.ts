import { useAuth } from '@workduck-io/dwindle'
import { USE_API } from '../data/Defaults/dev_'
import { useSaver } from '../editor/Components/Saver'
import useDataStore from '../store/useDataStore'
import { useLinks } from './useLinks'

import { useAuthStore } from '../services/auth/useAuth'
import { API } from '../../src/API'

/**
 * Has been repurposed into starred notes
 * TODO: Refactor after namespaces from backend
 */
export const useBookmarks = () => {
  const setBookmarks = useDataStore((state) => state.setBookmarks)
  const getBookmarks = useDataStore((state) => state.getBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)
  const removeBookmarks = useDataStore((state) => state.removeBookamarks)
  const { userCred } = useAuth()
  const { getPathFromNodeid } = useLinks()


  const isBookmark = (nodeid: string) => {
    const bookmarks = useDataStore.getState().bookmarks
    return [...bookmarks].indexOf(nodeid) > -1
  }

  const addBookmark = async (nodeid: string) => {
    if (!USE_API) {
      addBookmarks([nodeid])
      return true
    }
    if (userCred) {
      await API.bookmark
        .create(nodeid)
        .then(() => {
          addBookmarks([nodeid])
        })
        .catch(console.error)
    }
  }

  const getAllBookmarks = async () => {
    if (!USE_API) {
      return getBookmarks()
    }

    await API.bookmark
      .getAll()
      .then((d) => {
        // console.log('Data', d.data)

        if (d) {
          const bookmarks = d.filter((nodeid: string) => getPathFromNodeid(nodeid) !== undefined)
          setBookmarks(bookmarks)
        }
        return d
      })
      .catch(console.error)
  }

  const removeBookmark = async (nodeid: string) => {
    if (!USE_API) {
      removeBookmarks([nodeid])
      return true
    }
    if (userCred) {
      return await API.bookmark
        .remove(nodeid)
        .then(() => {
          removeBookmarks([nodeid])
        })
        .catch(console.error)
    }
  }

  return { isBookmark, addBookmark, removeBookmark, getAllBookmarks }
}
