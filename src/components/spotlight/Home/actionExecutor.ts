export enum ActionType {
  'search',
  'open',
  'render',
  'ilink',
  'action',
  'browser_search'
}

export interface MexitAction {
  id: string
  title: string
  description?: string
  type: ActionType
  shortcut?: string[]
  icon?: string
  data?: any
  metadata?: any
}

export function actionExec(action: MexitAction, query?: string) {
  switch (action.type) {
    case ActionType.action:
      // chrome.runtime.sendMessage({ request: action.data.action_name })
      break
    case ActionType.open:
      window.open(action.data.base_url, '_blank').focus()

      break
    case ActionType.render:
      // render the component present in the action
      break
    case ActionType.search: {
      const url = encodeURI(action.data.base_url + query)
      window.open(url, '_blank').focus()

      break
    }
    case ActionType.browser_search: {
      // chrome.runtime.sendMessage({ request: action })
      break
    }
  }
}
