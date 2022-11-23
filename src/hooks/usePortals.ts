import { apiURLs } from '@apis/routes'
import usePortalStore, { PortalType } from '@components/mex/Integrations/Portals/usePortalStore'
import { ActionGroupType } from '@components/spotlight/Actions/useActionStore'
import { WORKSPACE_HEADER } from '@data/Defaults/defaults'
import { useAuthStore } from '@services/auth/useAuth'
import { mog } from '@utils/lib/mog'

import { client } from '@workduck-io/dwindle'

import { useNamespaces } from './useNamespaces'

export const usePortals = () => {
  const setApps = usePortalStore((store) => store.setApps)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { getNamespaceOfNodeid } = useNamespaces()
  const connectPortal = usePortalStore((store) => store.connectPortal)
  const updateConnectedPortals = usePortalStore((store) => store.updateConnectedPortals)
  const setConnectedPortals = usePortalStore((store) => store.setConnectedPortals)

  const getPortals = async () => {
    try {
      const res = await client.get<Record<string, ActionGroupType>>(apiURLs.loch.getAllServices, {
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

  const connectToPortal = async (actionGroupId: string, serviceId: string, parentNodeId: string) => {
    const workspaceId = getWorkspaceId()
    const namespaceId = getNamespaceOfNodeid(parentNodeId)?.id

    const portal: PortalType = { serviceId, parentNodeId, serviceType: actionGroupId, mexId: workspaceId, namespaceId }

    try {
      const res = client.post(apiURLs.loch.connectToService, portal, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      if (res) {
        connectPortal(portal)
      }
    } catch (err) {
      mog('Unable to connect to portal')
    }
  }

  const updateParentNote = async (actionGroupId: string, serviceId: string, parentNodeId: string) => {
    const reqBody = {
      serviceId,
      serviceType: actionGroupId,
      parentNodeId
    }

    try {
      const res = await client.put(apiURLs.loch.updateParentNoteOfService, reqBody, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      if (res) {
        updateConnectedPortals(actionGroupId, serviceId, parentNodeId)
      }
    } catch (err) {
      mog('Unable to update parent note')
    }
  }

  const getConnectedPortals = async () => {
    try {
      const res = await client.get(apiURLs.loch.getConnectedServices, {
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
    updateParentNote,
    getConnectedPortals
  }
}
