import React from 'react'

import { getInitialNode } from '@utils/initial'
import create from 'zustand'

import { ComboTriggerType } from '../editor/Components/combobox/useComboboxStore'

export interface NodeProperties {
  title: string
  id: string
  nodeid: string
  path: string
  namespace: string
}

export type EditorContextType = {
  // State

  // Data of the current node
  node: NodeProperties

  readOnly: boolean

  // * Checks if there's an active trigger in the editor
  trigger?: ComboTriggerType | undefined
  setTrigger: (trigger: ComboTriggerType | undefined) => void

  setUid: (nodeid: string) => void
  setNode: (node: NodeProperties) => void

  fetchingContent: boolean

  loadingNodeid: string | null
  setLoadingNodeid: (nodeid: string) => void
  clearLoadingNodeid: () => void

  // State transformations
  //* On change
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void

  // Load a node and its contents in the editor
  loadNode: (node: NodeProperties) => void

  setFetchingContent: (value: boolean) => void

  activeUsers?: Array<string>
  setActiveUsers?: (users: Array<string>) => void
  addUser: (userId: string) => void
  removeUser: (usersId: string) => void

  isBannerVisible?: boolean
  notifyWithBanner: (showBanner: boolean) => void

  setReadOnly: (isReadOnly: boolean) => void
}

export const useEditorStore = create<EditorContextType>((set, get) => ({
  node: getInitialNode(),
  readOnly: false,

  isBannerVisible: false,
  notifyWithBanner: (showBanner: boolean) => set({ isBannerVisible: showBanner }),

  fetchingContent: false,
  setTrigger: (trigger) => set({ trigger }),

  activeUsers: [],
  setActiveUsers: (users) => {
    set({ activeUsers: users, isBannerVisible: users.length !== 0 })
  },
  addUser: (userId) => {
    const s = get().activeUsers
    set({ activeUsers: [...s, userId], isBannerVisible: true })
  },
  removeUser: (userId) => {
    const userToRemoveAtIndex = get().activeUsers.findIndex((id) => id === userId)

    if (userToRemoveAtIndex >= 0) {
      const newUsers = get().activeUsers
      newUsers.splice(userToRemoveAtIndex, 1)

      set({ activeUsers: newUsers, isBannerVisible: newUsers.length !== 0 })
    }
  },

  setReadOnly: (isReadOnly: boolean) => {
    set({ readOnly: isReadOnly })
  },

  setUid: (nodeid) => {
    const node = get().node
    node.nodeid = nodeid
    set({ node })
  },

  isEditing: false,
  setIsEditing: (isEditing: boolean) => {
    if (get().isEditing === isEditing) return
    set({ isEditing })
  },

  setNode: (node: NodeProperties) => set({ node }),

  setFetchingContent: (value) =>
    set({
      fetchingContent: value
    }),

  loadingNodeid: null,
  setLoadingNodeid: (nodeid) =>
    set({
      loadingNodeid: nodeid
    }),
  clearLoadingNodeid: () =>
    set({
      loadingNodeid: null
    }),

  loadNode: (node: NodeProperties) => {
    set({
      node
    })
  }
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withNodeOps = (Component: any) => {
  return function C2(props: any) {
    const loadNode = useEditorStore((state) => state.loadNode)
    const currentNode = useEditorStore((state) => state.node)

    return <Component loadNode={loadNode} currentNode={currentNode} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
