import { client, useAuth } from '@workduck-io/dwindle'
import { apiURLs } from '../../Requests/routes'
import useDataStore from '../../Editor/Store/DataStore'
import { USE_API } from '../../Defaults/dev_'
import { useSaver } from '../../Editor/Components/Saver'
import { useAuthStore } from '../useAuth/useAuth'
import { ILink } from '../../Editor/Store/Types'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const getAllNodesFromArchive = useDataStore((state) => state.getArchive)
  const addUidInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const { onSave } = useSaver()
  const { userCred } = useAuth()

  const archived = (uid: string) => {
    const archive = getAllNodesFromArchive()
    return archive.map((i) => i.uid).indexOf(uid) > -1
  }

  const addInArchive = async (nodes: ILink[]): Promise<boolean> => {
    if (!USE_API) {
      addUidInArchive(nodes)
      return true
    }
    if (userCred) {
      return await client
        .post(
          apiURLs.archiveNodes(),
          nodes.map((i) => i.uid)
        )
        // .then(console.log)
        .then(() => {
          addUidInArchive(nodes)
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

  const unarchive = async (nodes: ILink[]) => {
    if (!USE_API) {
      return removeArchive(nodes)
    }
    await client
      .post(
        apiURLs.unArchiveNodes(),
        nodes.map((i) => i.uid)
      )
      .then((d) => {
        console.log('Data', d.data)
        if (d.data) removeArchive(nodes)
        return d.data
      })
      .catch(console.error)
  }

  const getArchive = async () => {
    if (!USE_API) {
      return getAllNodesFromArchive()
    }

    await client
      .get(apiURLs.getArchivedNodes(getWorkspaceId()))
      .then((d) => {
        console.log('Data', d.data)
        if (d.data) setArchive(d.data)
        return d.data
      })
      .catch(console.error)
  }

  const removeFromArchive = async (uids: ILink[]): Promise<boolean> => {
    if (!USE_API) {
      removeArchive(uids)
      return true
    }

    if (userCred) {
      const res = await client
        .post(
          apiURLs.deleteArchiveNodes(),
          uids.map((i) => i.uid)
        )
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

  return { archived, addInArchive, removeFromArchive, getArchive, unarchive }
}

export default useArchive
