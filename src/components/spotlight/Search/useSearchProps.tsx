import Document from '@iconify-icons/gg/file-document'
import { ItemActionType } from '../SearchResults/types'
import LensIcon from '@iconify-icons/ph/magnifying-glass-bold'
import { cleanString } from '../../../data/Defaults/idPrefixes'
import { mog } from '../../../utils/lib/helper'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'

export const useSearchProps = () => {
  const currentListItem = useSpotlightEditorStore((store) => store.currentListItem)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const node = useSpotlightEditorStore((store) => store.node)
  const { activeIndex, searchResults, search } = useSpotlightContext()

  const icon = !normalMode ? Document : LensIcon
  const activeItem = searchResults[activeIndex]
  const nodePath = activeItem?.extras?.new ? cleanString(search.value.slice(2) || node.path) : activeItem?.title

  const path = searchResults?.[activeIndex]?.type === ItemActionType.ilink ? nodePath : node.path
  const placeholder = !normalMode ? cleanString(path) : '[[  for links or / for actions'

  return {
    icon: currentListItem?.icon ?? icon,
    placeholder: currentListItem?.description ?? placeholder
  }
}
export default useSearchProps
