import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { useBufferStore } from '@hooks/useEditorBuffer'
import { useReminderStore } from '@hooks/useReminders'
import { useAuthStore } from '@services/auth/useAuth'
import { useTokenStore } from '@services/auth/useTokens'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { useMentionStore } from '@store/useMentionStore'
import { useRecentsStore } from '@store/useRecentsStore'
import { useSnippetStore } from '@store/useSnippetStore'
import useTodoStore from '@store/useTodoStore'
import { useUserPreferenceStore } from '@store/userPreferenceStore'

import { useAuthStore as useDwindleAuthStore } from '@workduck-io/dwindle'

import { syncStoreState } from '.'
import { BroadcastSyncedChannel } from './types'
import useMultipleEditors from '@store/useEditorsStore'

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
        { field: 'tagsCache' },
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
    syncStoreState(useMultipleEditors, {
      name: BroadcastSyncedChannel.MULTIPLE_EDITORS,
      sync: [{ field: 'pinned' }]
    })
  }
}

export default syncStores
