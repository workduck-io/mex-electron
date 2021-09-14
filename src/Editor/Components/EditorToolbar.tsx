import boldIcon from '@iconify-icons/ri/bold'
import doubleQuotesL from '@iconify-icons/ri/double-quotes-l'
import h1 from '@iconify-icons/ri/h-1'
import h2 from '@iconify-icons/ri/h-2'
import h3 from '@iconify-icons/ri/h-3'
import italicIcon from '@iconify-icons/ri/italic'
import listOrdered from '@iconify-icons/ri/list-ordered'
import listUnordered from '@iconify-icons/ri/list-unordered'
import underlineIcon from '@iconify-icons/ri/underline'
import { Icon } from '@iconify/react'
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  getPlatePluginType,
  MARK_BOLD,
  MARK_ITALIC,
  ToolbarButtonProps,
  ToolbarElement,
  ToolbarList,
  ToolbarMark,
  useEventEditorId,
  useStoreEditorRef
} from '@udecode/plate'
import React, { useEffect, useState } from 'react'
import { ButtonSeparator } from '../../Styled/Toolbar'
import { BalloonToolbar } from './BalloonToolbar'
import LinkButton from './BalloonToolbar/LinkButton'

const BallonToolbarMarks = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'))
  const [selected, setSelected] = useState(false)

  const arrow = true
  const direction = 'top'
  const hiddenDelay = 0
  const tooltip = {
    arrow: true,
    delay: 0,
    theme: 'mex',
    duration: [200, 0] as [number, number],
    // hideOnClick: false,
    offset: [0, 17] as [number, number],
    placement: 'top' as const
  }

  return (
    <BalloonToolbar direction={direction} hiddenDelay={hiddenDelay} arrow={arrow} selected={selected}>
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<Icon height={20} icon={h1} />}
        tooltip={{ content: 'Heading 1', ...tooltip }}
      />

      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<Icon height={20} icon={h2} />}
        tooltip={{ content: 'Heading 2', ...tooltip }}
      />

      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={<Icon height={20} icon={h3} />}
        tooltip={{ content: 'Heading 3', ...tooltip }}
      />

      <ButtonSeparator />

      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon height={20} icon={doubleQuotesL} />}
        tooltip={{ content: 'Quote', ...tooltip }}
      />

      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<Icon height={20} icon={listUnordered} />}
        tooltip={{ content: 'Bullet List', ...tooltip }}
      />

      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<Icon height={20} icon={listOrdered} />}
        tooltip={{ content: 'Ordered List', ...tooltip }}
      />

      <ButtonSeparator />

      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon height={20} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon height={20} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />

      {/* Looses focus when used. */}
      <LinkButton
        tooltip={{ content: 'Link', ...tooltip }}
        icon={<Icon height={20} icon={underlineIcon} />}
        setSelected={setSelected}
      />
    </BalloonToolbar>
  )
}

export interface ToolbarLinkProps extends ToolbarButtonProps {
  /**
   * Default onMouseDown is getting the link url by calling this promise before inserting the image.
   */
  getLinkUrl?: (prevUrl: string | null) => Promise<string | null>
}

export default BallonToolbarMarks
