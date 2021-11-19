import boldIcon from '@iconify-icons/ri/bold'
import doubleQuotesL from '@iconify-icons/ri/double-quotes-l'
import h1 from '@iconify-icons/ri/h-1'
import h2 from '@iconify-icons/ri/h-2'
import h3 from '@iconify-icons/ri/h-3'
import italicIcon from '@iconify-icons/ri/italic'
import linkIcon from '@iconify-icons/ri/link'
import listOrdered from '@iconify-icons/ri/list-ordered'
import listUnordered from '@iconify-icons/ri/list-unordered'
import { Icon } from '@iconify/react'
import {
  BalloonToolbar,
  BlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  getPlatePluginType,
  ListToolbarButton,
  MarkToolbarButton,
  MARK_BOLD,
  MARK_ITALIC,
  ToolbarButtonProps,
  usePlateEditorRef,
  usePlateEventId
} from '@udecode/plate'
import React from 'react'
import { ButtonSeparator } from '../../Styled/Toolbar'
import LinkButton from './BalloonToolbar/LinkButton'

const BallonToolbarMarks = () => {
  const editor = usePlateEditorRef(usePlateEventId('focus'))

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
    <BalloonToolbar
      arrow={arrow}
      popperOptions={{
        // placement: 'top-start',
        offset: [0, 17]
      }}
    >
      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<Icon height={20} icon={h1} />}
        tooltip={{ content: 'Heading 1', ...tooltip }}
      />

      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<Icon height={20} icon={h2} />}
        tooltip={{ content: 'Heading 2', ...tooltip }}
      />

      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={<Icon height={20} icon={h3} />}
        tooltip={{ content: 'Heading 3', ...tooltip }}
      />

      <ButtonSeparator />

      <BlockToolbarButton
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon height={20} icon={doubleQuotesL} />}
        tooltip={{ content: 'Quote', ...tooltip }}
      />

      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<Icon height={20} icon={listUnordered} />}
        tooltip={{ content: 'Bullet List', ...tooltip }}
      />

      <ListToolbarButton
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<Icon height={20} icon={listOrdered} />}
        tooltip={{ content: 'Ordered List', ...tooltip }}
      />

      <ButtonSeparator />

      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon height={20} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon height={20} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />

      {/* Looses focus when used. */}
      <LinkButton tooltip={{ content: 'Link', ...tooltip }} icon={<Icon height={20} icon={linkIcon} />} />
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
