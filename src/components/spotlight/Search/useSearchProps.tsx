import Document from '@iconify-icons/gg/file-document'
import LensIcon from '@iconify-icons/ph/magnifying-glass-bold'
import { cleanString } from '../../../data/Defaults/idPrefixes'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'

export const useSearchProps = () => {
  const currentListItem = useSpotlightEditorStore((store) => store.currentListItem)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const node = useSpotlightEditorStore((store) => store.node)

  const icon = !normalMode ? Document : LensIcon

  const path = node.path
  const placeholder = !normalMode ? cleanString(path) : '[[  for links or / for actions'

  return {
    icon: currentListItem?.icon ?? icon,
    placeholder: currentListItem?.description ?? placeholder
  }
}
export default useSearchProps
