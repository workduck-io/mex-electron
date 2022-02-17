import { ipcRenderer } from 'electron'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { IpcAction } from '../../../data/IpcAction'
import { ListItemType, ItemActionType } from '../SearchResults/types'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../store/app.spotlight'

const useItemExecutor = () => {
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)
  const { setSearch, setActiveItem } = useSpotlightContext()
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const closeSpotlight = () => {
    setInput('')
    setSearch({ value: '', type: CategoryType.search })
    ipcRenderer.send(IpcAction.CLOSE_SPOTLIGHT, {
      data: {
        hide: true
      }
    })
    setActiveItem({ item: undefined, active: false })
  }

  function itemActionExecutor(item: ListItemType, query?: string) {
    switch (item.type) {
      case ItemActionType.action:
        break
      case ItemActionType.open:
        window.open(item.extras.base_url, '_blank').focus()
        closeSpotlight()

        break
      case ItemActionType.render:
        // render the component present in the item
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
