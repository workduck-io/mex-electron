import { mog } from '@utils/lib/helper'
import { StoreApi, State } from 'zustand'
import { isEqual, isEmpty } from 'lodash'
import { BroadcastSyncedChannel, PartialSyncStateType, SyncField, SyncMessageType } from './types'

if (!globalThis.__MEX_SYNCED_CHANNELS_) globalThis.__MEX_SYNCED_CHANNELS_ = new Set()

const getExistingSyncedChannels = (): Set<BroadcastSyncedChannel> | undefined => {
  const syncedChannels = globalThis.__MEX_SYNCED_CHANNELS_

  mog('Synced Channels', { syncedChannels })

  return syncedChannels
}

export const syncStoreState = <T extends State, K extends keyof T>(
  store: StoreApi<T>,
  options: { sync: SyncField<K>[]; name: BroadcastSyncedChannel; init?: boolean }
) => {
  const broadCastChannelName = options.name
  const channels = getExistingSyncedChannels()

  if (channels?.has(broadCastChannelName)) throw new Error(`${broadCastChannelName} Channel Already Exists!`)
  channels.add(broadCastChannelName)

  const newBroadCastSyncChannel = new BroadcastChannel(options.name)

  let isIncomingMessage = false
  let lastSyncedStateTimestamp = 0

  const subscribedChanges = store.subscribe((currentStoreState, prevStoreState) => {
    if (isIncomingMessage) {
      isIncomingMessage = false
      return
    }

    lastSyncedStateTimestamp = +new Date()
    const partialState: Record<string, PartialSyncStateType> = options.sync.reduce((prev, current) => {
      const field = current.field
      const storeState = currentStoreState[field]

      const canUpdateAtomicField = typeof storeState === 'object' && current.atomicField

      if (!isEqual(storeState, prevStoreState[field])) {
        return {
          ...prev,
          [field]: canUpdateAtomicField
            ? { state: storeState[current.atomicField], atomicField: current.atomicField }
            : { state: storeState }
        }
      }

      return prev
    }, {} as Record<string, PartialSyncStateType>)

    if (!isEmpty(partialState)) {
      newBroadCastSyncChannel.postMessage({ updatedAt: lastSyncedStateTimestamp, state: partialState })
    }
  })

  newBroadCastSyncChannel.onmessage = (ev: MessageEvent<SyncMessageType>) => {
    const incomingEventState = ev.data.state
    const incomingEventUpdatedAt = ev.data.updatedAt

    if (incomingEventUpdatedAt > lastSyncedStateTimestamp) {
      // * Update Store
      if (incomingEventState) {
        isIncomingMessage = true
        lastSyncedStateTimestamp = incomingEventUpdatedAt

        Object.entries(incomingEventState).map(([key, { state, atomicField }]) => {
          store.setState((prev) => ({
            ...prev,
            [key]: atomicField ? { ...prev[key], [atomicField]: state } : state
          }))
        })
      }
    }
  }

  if (options.init) {
    // * TODO
  }
}
