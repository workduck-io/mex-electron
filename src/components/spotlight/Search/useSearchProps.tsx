import LensIcon from '@iconify-icons/ph/magnifying-glass-bold'
import Document from '@iconify-icons/gg/file-document'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { mog } from '../../../utils/lib/helper'

export const useSearchProps = () => {
  const currentListItem = useSpotlightEditorStore((store) => store.currentListItem)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const node = useSpotlightEditorStore((store) => store.node)

  const { selection } = useSpotlightContext()

  mog('ITEM', { currentListItem })

  const icon = !normalMode || selection ? Document : LensIcon
  const placeholder = !normalMode || selection ? node.nodeid : 'Search for anything...'

  return {
    icon: currentListItem?.icon ?? icon,
    placeholder: currentListItem?.description ?? placeholder
  }
}
export default useSearchProps
