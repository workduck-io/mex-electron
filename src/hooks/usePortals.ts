import usePortalStore, { PortalType } from '@components/mex/Integrations/Portals/usePortalStore'
import { useAuthStore } from '@services/auth/useAuth'
import { mog } from '@utils/lib/mog'

import { API } from '../API'

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
      const res = await API.loch.getAllServices()
      if (res) {
        setApps(res)
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
      const res = await API.loch.connect(portal)
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
      const res = await API.loch.updateParent(reqBody)
      if (res) {
        updateConnectedPortals(actionGroupId, serviceId, parentNodeId)
      }
    } catch (err) {
      mog('Unable to update parent note')
    }
  }

  const getConnectedPortals = async () => {
    try {
      const res = await API.loch.getAllConnected()
      if (res) {
        setConnectedPortals(res)
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
