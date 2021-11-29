import { client, useAuth } from '@workduck-io/dwindle'
import { apiURLs } from '../../Requests/routes'
import useDataStore from '../../Editor/Store/DataStore'
import { USE_API } from '../../Defaults/dev_'
import { useSaver } from '../../Editor/Components/Saver'
import { useAuthStore } from '../useAuth/useAuth'
import { ILink } from '../../Editor/Store/Types'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const getArchive = useDataStore((state) => state.getArchive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const { onSave } = useSaver()
  const { userCred } = useAuth()

  const archived = (uid: string) => {
    const archive = getArchive()
    return archive.map((i) => i.uid).indexOf(uid) > -1
  }

  const addArchiveData = async (nodes: ILink[]): Promise<boolean> => {
    if (!USE_API) {
      addInArchive(nodes)
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
    if (!USE_API) {
      return unArchive(nodes[0])
    }
    await client
      .post(
        apiURLs.unArchiveNodes(),
        nodes.map((i) => i.uid)
      )
      .then((d) => {
        console.log('Data', d.data)
        if (d.data) unArchive(nodes[0])
        return d.data
      })
      .catch(console.error)
  }

  const getArchiveData = async () => {
    if (!USE_API) {
      return getArchive()
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

  const removeArchiveData = async (uids: ILink[]): Promise<boolean> => {
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

  return { archived, addArchiveData, removeArchiveData, getArchiveData, unArchiveData }
}

export default useArchive
