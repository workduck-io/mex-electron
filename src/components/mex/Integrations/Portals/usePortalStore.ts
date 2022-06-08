import create from 'zustand'
import { persist } from 'zustand/middleware'
import { ActionGroupType } from '@components/spotlight/Actions/useActionStore'

const PORTAL_STORE_KEY = 'apps-portal-store'

type PortalStoreType = {
  apps: Record<string, ActionGroupType>
  setApps: (apps: Record<string, ActionGroupType>) => void

  linkedNotes: Record<string, string>
  setLinkedNotes: (linkedNotes: Record<string, string>) => void
  linkNoteToApp: (noteId: string, actionGroupId: string) => void

  connectedPortals: Array<any>
  setConnectedPortals: (connectedPortals: []) => void
  getIsPortalConnected: (actionGroupId: string) => any
}

const usePortalStore = create<PortalStoreType>(
  persist(
    (set, get) => ({
      apps: {},
      setApps: (apps) => set({ apps }),

      linkedNotes: {},
      setLinkedNotes: (linkedNotes: Record<string, string>) => set({ linkedNotes }),
      linkNoteToApp: (noteId: string, actionGroupId: string) => {
        const linkedNotes = get().linkedNotes
        set({ linkedNotes: { ...linkedNotes, [actionGroupId]: noteId } })
      },
      connectedPortals: [],
      setConnectedPortals: (connectedPortals) => set({ connectedPortals }),
      getIsPortalConnected: (actionGroupId: string) => {
        const connectedPortals = get().connectedPortals

        return connectedPortals.find((portal) => portal.actionGroupId === actionGroupId)
      }
    }),
    {
      name: PORTAL_STORE_KEY,
      partialize: (state) => ({
        apps: state.apps,
        linkedNotes: state.linkedNotes,
        connectedPortals: state.connectedPortals
      })
    }
  )
)

export default usePortalStore
