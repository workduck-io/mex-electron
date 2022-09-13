import { CategoryType } from '../../../store/Context/context.spotlight'
import { Shortcut } from '../../mex/Help/Help.types'
import { QuickLinkType } from '../../mex/NodeSelect/types'

export const spotlightShortcuts = {
  save: {
    title: 'Save changes',
    keystrokes: '$mod+Enter',
    category: 'Action'
  },
  open: {
    title: 'Open item',
    keystrokes: 'Enter',
    category: 'Action'
  },
  escape: {
    title: 'Save and Escape',
    keystrokes: 'Escape',
    category: 'Navigation'
  },
  Tab: {
    title: 'Create new quick note',
    keystrokes: 'Tab',
    category: 'Action'
  }
}

export const ElementTypeBasedShortcut: Record<string, Record<string, Shortcut>> = {
  [QuickLinkType.backlink]: {
    link: {
      ...spotlightShortcuts.open,
      title: 'to Link'
    },
    inlineBlock: {
      ...spotlightShortcuts.Tab,
      title: 'to Embed'
    }
  },
  [QuickLinkType.mentions]: {
    link: {
      ...spotlightShortcuts.open,
      title: 'to Share'
    },

    insertOnly: {
      ...spotlightShortcuts.Tab,
      title: 'to Insert only'
    }
  },
  [QuickLinkType.snippet]: {
    snippet: {
      ...spotlightShortcuts.open,
      title: 'to Insert'
    }
  },
  [CategoryType.performed]: {
    action: {
      ...spotlightShortcuts.open,
      title: 'to Insert'
    }
  },
  [CategoryType.action]: {
    action: {
      ...spotlightShortcuts.open,
      title: 'to Insert'
    }
  }
}
