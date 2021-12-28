import { client, useAuth } from '@workduck-io/dwindle'
import { apiURLs } from '../../Requests/routes'
import useDataStore from '../../Editor/Store/DataStore'
import { USE_API } from '../../Defaults/dev_'
import { useSaver } from '../../Editor/Components/Saver'
import { useLinks } from '../../Editor/Actions/useLinks'

export const useBookmarks = () => {
  const setBookmarks = useDataStore((state) => state.setBookmarks)
  const getBookmarks = useDataStore((state) => state.getBookmarks)
  const addBookmarks = useDataStore((state) => state.addBookmarks)
  const removeBookmarks = useDataStore((state) => state.removeBookamarks)
  const { onSave } = useSaver()
  const { userCred } = useAuth()
  const { getNodeIdFromUid } = useLinks()

  const isBookmark = (uid: string) => {
    const bookmarks = getBookmarks()
    return bookmarks.indexOf(uid) > -1
  }

  const addBookmark = async (uid: string): Promise<boolean> => {
    if (!USE_API) {
      addBookmarks([uid])
      return true
    }
    if (userCred) {
      return await client
        .post(apiURLs.bookmark(userCred.userId, uid), {
          type: 'BookmarkRequest'
        })
        // .then(console.log)
        .then(() => {
          addBookmarks([uid])
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
      .get(apiURLs.getBookmarks(userCred.userId))
      .then((d) => {
        // console.log('Data', d.data)

        if (d.data) {
          const bookmarks = d.data.filter((uid: string) => getNodeIdFromUid(uid) !== undefined)
          setBookmarks(bookmarks)
        }
        return d.data
      })
      .catch(console.error)
  }

  const removeBookmark = async (uid: string): Promise<boolean> => {
    if (!USE_API) {
      removeBookmarks([uid])
      return true
    }
    if (userCred) {
      const res = await client
        .patch(apiURLs.bookmark(userCred.userId, uid), {
          type: 'BookmarkRequest'
        })
        // .then(console.log)
        .then(() => {
          removeBookmarks([uid])
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
