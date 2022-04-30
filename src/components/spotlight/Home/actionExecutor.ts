import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ItemActionType, ListItemType } from '../SearchResults/types'

import { AppType } from '../../../hooks/useInitialize'
import { IpcAction } from '../../../data/IpcAction'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { useActionStore } from '../Actions/useActionStore'
import { NavigationType, useRouting } from '../../../views/routes/urls'
import { mog } from '../../../utils/lib/helper'

const useItemExecutor = () => {
  const { setSearch, setActiveItem } = useSpotlightContext()
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)
  const initAction = useActionStore((store) => store.initAction)
  const { goTo } = useRouting()

  const closeSpotlight = () => {
    setInput('')
    setSearch({ value: '', type: CategoryType.search })
    appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })

    setActiveItem({ item: undefined, active: false })
  }

  const itemActionExecutor = (item: ListItemType, query?: string, isMetaPressed?: boolean) => {
    switch (item.type) {
      case ItemActionType.action:
        setSearch({ value: '', type: CategoryType.search })
        setInput('')

        // eslint-disable-next-line no-case-declarations
        const actionGroupInfo = item?.extras?.actionGroup

        if (actionGroupInfo) {
          initAction(actionGroupInfo.actionGroupId, item.id)
        }

        goTo('action', NavigationType.push)

        break
      case ItemActionType.customAction:
        if (item.extras.customAction) item.extras.customAction()
        closeSpotlight()
        break
      case ItemActionType.twinOpen:
        if (!isMetaPressed && item.extras.customAction) item.extras.customAction()
        else window.open(item.extras.base_url, '_blank').focus()
        closeSpotlight()
        break
      case ItemActionType.open:
        window.open(item.extras.base_url, '_blank').focus()
        closeSpotlight()
        break
      case ItemActionType.render:
        // render the component present in the item
        break
      case ItemActionType.ipc:
        appNotifierWindow(item.extras.ipcAction, AppType.SPOTLIGHT)
        break
      case ItemActionType.search: {
        const url = encodeURI(item.extras.base_url + query)
        window.open(url, '_blank').focus()
        setCurrentListItem(undefined)

        closeSpotlight()

        break
      }
      case ItemActionType.browser_search: {
        break
      }
    }
  }

  return {
    itemActionExecutor
  }
}

export default useItemExecutor
