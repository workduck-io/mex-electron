export const defaultShortcuts = {
  // Navigation
  showSettings: {
    title: 'Settings',
    keystrokes: '$mod+,',
    category: 'Navigate'
  },
  showEditor: {
    title: 'Editor',
    keystrokes: '$mod+Shift+KeyE',
    category: 'Navigate'
  },
  showSearch: {
    title: 'Search',
    keystrokes: '$mod+F',
    category: 'Navigate'
  },
  showIntegrations: {
    title: 'Integrations',
    keystrokes: '$mod+Shift+KeyI',
    category: 'Navigate',
    disabled: true
  },
  showSuggestedNodes: {
    title: 'Suggest Nodes',
    keystrokes: '$mod+/',
    category: 'Actions'
  },
  showSnippets: {
    title: 'Snippets',
    keystrokes: '$mod+Shift+KeyS',
    category: 'Navigate'
  },
  showTasks: {
    title: 'Tasks',
    keystrokes: '$mod+Shift+KeyT',
    category: 'Navigate'
  },
  showHelp: {
    title: 'Help',
    keystrokes: '$mod+Shift+KeyH',
    category: 'Navigate'
  },

  // Goto
  gotoForward: {
    title: 'Move Forward History',
    keystrokes: '$mod+]',
    category: 'Navigate'
  },
  gotoBackwards: {
    title: 'Move Backwards History',
    keystrokes: '$mod+[',
    category: 'Navigate'
  },

  // Actions
  newNode: {
    title: 'Create New Node',
    keystrokes: '$mod+KeyN',
    category: 'Actions'
  },
  save: {
    title: 'Save current Node',
    keystrokes: '$mod+KeyS',
    category: 'Actions'
  },
  refreshNode: {
    title: 'Refresh current Node',
    keystrokes: '$mod+KeyR',
    category: 'Actions'
  },
  toggleFocusMode: {
    title: 'Toggle Focus Mode',
    keystrokes: '$mod+Backslash',
    category: 'Actions'
  },
  showSyncBlocks: {
    title: 'Flow Links',
    keystrokes: '$mod+Shift+KeyF',
    category: 'Actions',
    disabled: true
  },
  showGraph: {
    title: 'Context View',
    keystrokes: '$mod+Shift+KeyG',
    category: 'Actions'
  },
  showArchive: {
    title: 'Archive',
    keystrokes: '$mod+Shift+KeyA',
    category: 'Actions'
  },
  showLookup: {
    title: 'Open Lookup',
    keystrokes: '$mod+KeyL',
    category: 'Actions'
  },
  showSpotlight: {
    title: 'Open Spotlight',
    keystrokes: '$mod+Shift+KeyL',
    category: 'Actions',
    global: true
  },
  showArchiveModal: {
    title: 'Archive Node',
    keystrokes: '$mod+Shift+KeyD',
    category: 'Actions'
  },
  showRefactor: {
    title: 'Open Refactor',
    keystrokes: '$mod+Shift+KeyR',
    category: 'Actions'
  },
  showRename: {
    title: 'Open Rename',
    keystrokes: '$mod+Shift+KeyN',
    category: 'Actions'
  }
}
