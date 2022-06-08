import { apiURLs } from '@apis/routes'
import usePortalStore from '@components/mex/Integrations/Portals/usePortalStore'
import { ActionGroupType } from '@components/spotlight/Actions/useActionStore'
import { WORKSPACE_HEADER } from '@data/Defaults/defaults'
import { useAuthStore } from '@services/auth/useAuth'
import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'

export const usePortals = () => {
  const setApps = usePortalStore((store) => store.setApps)
  const linkedNotes = usePortalStore((store) => store.linkedNotes)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setConnectedPortals = usePortalStore((store) => store.setConnectedPortals)

  const getPortals = async () => {
    try {
      const res = await client.get<Record<string, ActionGroupType>>(apiURLs.getLochServices(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      if (res) {
        setApps(res.data)
      }
    } catch (err) {
      mog('Unable to get apps')
    }
  }

  const connectToPortal = async (actionGroupId: string, serviceId: string, noteId: string) => {
    const linkedNote = linkedNotes[actionGroupId]
    const workspaceId = getWorkspaceId()

    const reqBody = { serviceId, parentNodeId: linkedNote, serviceType: actionGroupId, mexId: workspaceId }

    try {
      const res = client.post(apiURLs.connectToLochService(), reqBody, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
    } catch (err) {
      mog('Unable to connect to portal')
    }
  }

  const getConnectedPortals = async () => {
    try {
      const res = await client.get(apiURLs.getConnectedLochServices(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })

      if (res) {
        setConnectedPortals(res.data)
      }
    } catch (err) {
      mog('Unable to get connected portals', { err })
    }
  }

  const initPortals = async () => {
    try {
      const res = await Promise.all([getPortals(), getConnectedPortals()])
      if (res) mog('Portals initialized')
    } catch (err) {
      mog('Unable to init portals', { err })
    }
  }

  return {
    getPortals,
    initPortals,
    connectToPortal,
    getConnectedPortals
  }
}
