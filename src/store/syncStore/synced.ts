import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { useRecentsStore } from '@store/useRecentsStore'
import { useSnippetStore } from '@store/useSnippetStore'
import { useAuthStore } from '@services/auth/useAuth'
import useDwindleAuthStore from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'
import { syncStoreState } from '.'
import { BroadcastSyncedChannel } from './types'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { useReminderStore } from '@hooks/useReminders'
import { useMentionStore } from '@store/useMentionStore'
import { useTokenStore } from '@services/auth/useTokens'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { useBufferStore } from '@hooks/useEditorBuffer'
import useTodoStore from '@store/useTodoStore'

const syncStores = () => {
  if ('BroadcastChannel' in globalThis) {
    syncStoreState(useContentStore, { name: BroadcastSyncedChannel.CONTENTS, sync: [{ field: 'contents' }] })
    syncStoreState(useRecentsStore, {
      name: BroadcastSyncedChannel.RECENTS,
      sync: [{ field: 'lastOpened' }, { field: 'recentResearchNodes' }]
    })
    syncStoreState(useTokenStore, {
      name: BroadcastSyncedChannel.TOKEN_DATA,
      sync: [{ field: 'data' }]
    })
    syncStoreState(useSnippetStore, {
      name: BroadcastSyncedChannel.SNIPPETS,
      sync: [{ field: 'snippets' }]
    })
    syncStoreState(useDataStore, {
      name: BroadcastSyncedChannel.DATA,
      sync: [
        { field: 'ilinks' },
        { field: 'linkCache' },
        { field: 'archive' },
        { field: 'sharedNodes' },
        { field: 'slashCommands' },
        { field: 'tags' }
      ]
    })
    syncStoreState(useReminderStore, {
      name: BroadcastSyncedChannel.REMINDERS,
      sync: [{ field: 'reminders' }, { field: 'armedReminders' }]
    })
    syncStoreState(useMentionStore, {
      name: BroadcastSyncedChannel.MENTIONS,
      sync: [{ field: 'mentionable' }, { field: 'invitedUsers' }]
    })
    syncStoreState(useAuthStore, {
      name: BroadcastSyncedChannel.AUTH,
      sync: [{ field: 'authenticated' }, { field: 'userDetails' }, { field: 'workspaceDetails' }]
    })
    syncStoreState(useDwindleAuthStore, {
      name: BroadcastSyncedChannel.DWINDLE,
      sync: [{ field: 'userCred' }]
    })
    syncStoreState(useUserPreferenceStore, {
      name: BroadcastSyncedChannel.USER_PROPERTIES,
      sync: [{ field: 'lastOpenedNotes' }, { field: 'theme' }]
    })
    syncStoreState(useActionsCache, {
      name: BroadcastSyncedChannel.ACTIONS,
      sync: [
        { field: 'connectedGroups' },
        { field: 'actions' },
        { field: 'actionGroups' },
        { field: 'groupedActions' },
        { field: 'resultHashCache' }
      ]
    })
    syncStoreState(useBufferStore, {
      name: BroadcastSyncedChannel.EDITOR_BUFFER,
      sync: [{ field: 'buffer' }]
    })
    syncStoreState(useTodoStore, {
      name: BroadcastSyncedChannel.TASKS,
      sync: [{ field: 'todos' }]
    })
  }
}

export default syncStores
