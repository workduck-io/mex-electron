import useMergedRef from '@react-hook/merged-ref'
import { getPreventDefaultHandler, PortalBody, useEditorState } from '@udecode/plate'
import React, { useEffect } from 'react'
import { ComboboxItem, ComboboxRoot } from '../../tag/components/TagCombobox.styles'
import { setElementPositionByRange } from '../../tag/utils/setElementPositionByRange'
import { useComboboxControls } from '../hooks/useComboboxControls'
import { useComboboxIsOpen } from '../selectors/useComboboxIsOpen'
import { useComboboxStore } from '../useComboboxStore'
import { ComboboxProps } from './Combobox.types'

export const Combobox = ({ onSelectItem, onRenderItem }: ComboboxProps) => {
  // TODO
  const at = useComboboxStore((state) => state.targetRange)
  const items = useComboboxStore((state) => state.items)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()

  const ref = React.useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const editor = useEditorState()
  // const _editor = useStoreEditorState(useEventEditorId('focus'));
  // console.log(editor === _editor);

  useEffect(() => {
    if (editor) setElementPositionByRange(editor, { ref, at })
  }, [at, editor])

  const menuProps = combobox ? combobox.getMenuProps() : { ref: null }

  const multiRef = useMergedRef(menuProps.ref, ref)

  if (!combobox) return null

  const comboProps = (item, index) => {
    if (combobox) {
      return combobox.getItemProps({
        item,
        index
      })
    }
  }

  return (
    <PortalBody>
      <ComboboxRoot {...menuProps} ref={multiRef} isOpen={isOpen}>
        {isOpen &&
          items.map((item, index) => {
            const Item = onRenderItem ? onRenderItem({ item }) : item.text

            return (
              <ComboboxItem
                key={item.key}
                highlighted={index === itemIndex}
                {...comboProps(item, index)}
                onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, item)}
              >
                {Item}
              </ComboboxItem>
            )
          })}
      </ComboboxRoot>
    </PortalBody>
  )
}
