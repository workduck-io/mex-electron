export const defaultShortcuts = {
  // Navigation
  showSettings: {
    title: 'Settings',
    keystrokes: '$mod+,',
    category: 'Navigate'
  },
  showEditor: {
    title: 'Notes',
    keystrokes: '$mod+Shift+KeyE',
    category: 'Navigate'
  },
  showSearch: {
    title: 'Search',
    keystrokes: '$mod+F',
    category: 'Navigate'
  },
  showIntegrations: {
    title: 'Flows',
    keystrokes: '$mod+Shift+KeyI',
    category: 'Navigate',
    disabled: true
  },
  showSnippetSidebar: {
    title: 'Snippets',
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
    title: 'New Note',
    keystrokes: '$mod+KeyN',
    category: 'Actions'
  },
  save: {
    title: 'Save Note',
    keystrokes: '$mod+KeyS',
    category: 'Actions'
  },
  refreshNode: {
    title: 'Refresh Note',
    keystrokes: '$mod+KeyR',
    category: 'Actions'
  },
  toggleFocusMode: {
    title: 'Toggle Focus Mode',
    keystrokes: '$mod+Backslash',
    category: 'Actions'
  },
  toggleSidebar: {
    title: 'Toggle Sidebar',
    keystrokes: '$mod+Shift+Backslash',
    category: 'Actions'
  },
  // showSyncBlocks: {
  //   title: 'Flow Links',
  //   keystrokes: '$mod+Shift+KeyF',
  //   category: 'Actions',
  //   disabled: true
  // },
  showReminder: {
    title: 'Reminders',
    keystrokes: '$mod+Shift+KeyM',
    category: 'Actions'
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
    keystrokes: '$mod+Shift+KeyX',
    category: 'Actions',
    global: true
  },
  showArchiveModal: {
    title: 'Archive Note',
    keystrokes: '$mod+Shift+KeyD',
    category: 'Actions'
  },
  showRefactor: {
    title: 'Refactor',
    keystrokes: '$mod+Shift+KeyR',
    category: 'Actions',
    disabled: true
  },
  showRename: {
    title: 'Rename',
    keystrokes: '$mod+Shift+KeyN',
    category: 'Actions'
  }
}
