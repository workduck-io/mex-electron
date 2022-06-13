import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ActionGroupType } from '@components/spotlight/Actions/useActionStore'

const PORTAL_STORE_KEY = 'apps-portal-store'

type PortalStoreType = {
  apps: Record<string, ActionGroupType>
  setApps: (apps: Record<string, ActionGroupType>) => void

  connectedPortals: Array<any>
  setConnectedPortals: (connectedPortals: []) => void
  getIsPortalConnected: (actionGroupId: string) => any
  updateConnectedPortals: (actionGroupId: string, serviceId: string, parentNodeId: string) => void
}

const usePortalStore = create<PortalStoreType>(
  devtools(
    persist(
      (set, get) => ({
        apps: {},
        setApps: (apps) => set({ apps }),

        connectedPortals: [],
        setConnectedPortals: (connectedPortals) => set({ connectedPortals }),
        getIsPortalConnected: (actionGroupId: string) => {
          const connectedPortals = get().connectedPortals

          return connectedPortals.find((portal) => portal.serviceType === actionGroupId)
        },
        updateConnectedPortals: (actionGroupId, serviceId, parentNodeId) => {
          const connectedPortals = get().connectedPortals
          const newConnectedPortals = connectedPortals.map((portal) => {
            if (portal.serviceType === actionGroupId) {
              return { ...portal, serviceId, parentNodeId }
            }
            return portal
          })

          set({ connectedPortals: newConnectedPortals })
        }
      }),
      {
        name: PORTAL_STORE_KEY,
        partialize: (state) => ({
          apps: state.apps,
          connectedPortals: state.connectedPortals
        })
      }
    )
  )
)

export default usePortalStore
