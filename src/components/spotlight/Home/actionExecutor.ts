import { ipcRenderer } from 'electron'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { IpcAction } from '../../../data/IpcAction'
import { ListItemType, ItemActionType } from '../SearchResults/types'
import { SearchType, useSpotlightContext } from '../../../store/Context/context.spotlight'

const useItemExecutor = () => {
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)
  const { setSearch } = useSpotlightContext()

  const closeSpotlight = () => {
    ipcRenderer.send(IpcAction.CLOSE_SPOTLIGHT, {
      data: {
        hide: true
      }
    })
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
        setSearch({ value: '', type: SearchType.search })
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
