import { client, useAuth } from '@workduck-io/dwindle'
import { useAuthStore } from '../services/auth/useAuth'
import { apiURLs } from '../apis/routes'
import { USE_API } from '../data/Defaults/dev_'
import { useSaver } from '../editor/Components/Saver'
import useDataStore from '../store/useDataStore'
import { ILink } from '../types/Types'
import { mog } from '../utils/lib/helper'
// import { apiURLs } from '.../Editor/Store/Types'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const archive = useDataStore((state) => state.archive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const { onSave } = useSaver()
  const { userCred } = useAuth()

  const archived = (uid: string) => {
    return archive.map((i) => i.uid).indexOf(uid) > -1
  }

  const addArchiveData = async (nodes: ILink[]): Promise<boolean> => {
    if (!USE_API()) {
      addInArchive(nodes)
      return true
    }
    if (userCred) {
      return await client
        .post(apiURLs.archiveNodes(), {
          ids: nodes.map((i) => i.uid)
        })
        // .then(console.log)
        .then(() => {
          addInArchive(nodes)
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

  const unArchiveData = async (nodes: ILink[]) => {
    if (!USE_API()) {
      return unArchive(nodes[0])
    }
    await client
      .post(apiURLs.unArchiveNodes(), {
        ids: nodes.map((i) => i.uid)
      })
      .then((d) => {
        mog('Unarchive Data', d.data)
        if (d.data) unArchive(nodes[0])
        return d.data
      })
      .catch(console.error)
  }

  const getArchiveData = async () => {
    if (!USE_API()) {
      return archive
    }

    await client
      .get(apiURLs.getArchivedNodes(getWorkspaceId()))
      .then((d) => {
        if (d.data) {
          const ids = d.data
          const links = ids.filter((id) => archive.filter((ar) => ar.uid === id).length === 0)
          setArchive(links)
        }
        return d.data
      })
      .catch(console.error)
  }

  const removeArchiveData = async (uids: ILink[]): Promise<boolean> => {
    if (!USE_API()) {
      removeArchive(uids)
      return true
    }

    if (userCred) {
      const res = await client
        .post(apiURLs.deleteArchiveNodes(), {
          ids: uids.map((i) => i.uid)
        })
        // .then(console.log)
        .then(() => {
          removeArchive(uids)
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

  return { archived, addArchiveData, removeArchiveData, getArchiveData, unArchiveData }
}

export default useArchive
