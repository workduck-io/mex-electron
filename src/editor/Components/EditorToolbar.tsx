import AlignLeftIcon from '@iconify-icons/bx/bx-align-left'
import AlignCenterIcon from '@iconify-icons/bx/bx-align-middle'
import AlignRightIcon from '@iconify-icons/bx/bx-align-right'
import addLine from '@iconify-icons/ri/add-line'
import boldIcon from '@iconify-icons/ri/bold'
import doubleQuotesL from '@iconify-icons/ri/double-quotes-l'
import fileAddLine from '@iconify-icons/ri/file-add-line'
import h1 from '@iconify-icons/ri/h-1'
import h2 from '@iconify-icons/ri/h-2'
import h3 from '@iconify-icons/ri/h-3'
import italicIcon from '@iconify-icons/ri/italic'
import linkIcon from '@iconify-icons/ri/link'
import listOrdered from '@iconify-icons/ri/list-ordered'
import listUnordered from '@iconify-icons/ri/list-unordered'
import { Icon } from '@iconify/react'
import {
  AlignToolbarButton,
  BlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  ListToolbarButton,
  MarkToolbarButton,
  MARK_BOLD,
  MARK_ITALIC,
  ToolbarButtonProps,
  usePlateEditorRef,
  usePlateId
} from '@udecode/plate'
import React from 'react'
import { ButtonSeparator } from '../../style/Toolbar'
import { BalloonToolbar } from './BalloonToolbar'
import LinkButton from './BalloonToolbar/LinkButton'
import { SelectionToNode } from './BalloonToolbar/SelectionToNode'
import { SelectionToSnippet } from './BalloonToolbar/SelectionToSnippet'

// import { BalloonToolbar } from './BalloonToolbar'
// import LinkButton from './BalloonToolbar/LinkButton'

const BallonMarkToolbarButtons = () => {
  const editor = usePlateEditorRef()

  // const arrow = true
  // const direction = 'top'
  // const hiddenDelay = 0
  // const tooltip = {
  //   arrow: true,
  //   delay: 0,
  //   theme: 'mex',
  //   duration: [200, 0] as [number, number],
  //   // hideOnClick: false,
  //   offset: [0, 17] as [number, number],
  //   placement: 'top' as const
  // }
  const arrow = false
  const theme = 'dark'
  const top = 'top' as const
  const popperOptions = {
    placement: top
  }
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    theme: 'mex',
    hideOnClick: false,
    offset: [0, 17],
    placement: top
  } as any

  return (
    <BalloonToolbar popperOptions={popperOptions} theme={theme} arrow={arrow}>
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<Icon height={20} icon={h1} />}
        tooltip={{ content: 'Heading 1', ...tooltip }}
      />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<Icon height={20} icon={h2} />}
        tooltip={{ content: 'Heading 2', ...tooltip }}
      />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<Icon height={20} icon={h3} />}
        tooltip={{ content: 'Heading 3', ...tooltip }}
      />
      <ButtonSeparator />

      <AlignToolbarButton value="left" icon={<Icon icon={AlignLeftIcon} />} />
      <AlignToolbarButton value="center" icon={<Icon icon={AlignCenterIcon} />} />
      <AlignToolbarButton value="right" icon={<Icon icon={AlignRightIcon} />} />

      <ButtonSeparator />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon height={20} icon={doubleQuotesL} />}
        tooltip={{ content: 'Quote', ...tooltip }}
      />

      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<Icon height={20} icon={listUnordered} />}
        tooltip={{ content: 'Bullet List', ...tooltip }}
      />

      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<Icon height={20} icon={listOrdered} />}
        tooltip={{ content: 'Ordered List', ...tooltip }}
      />

      <ButtonSeparator />

      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<Icon height={20} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<Icon height={20} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />

      <ButtonSeparator />

      <SelectionToNode
        icon={<Icon height={20} icon={addLine} />}
        tooltip={{ content: 'Convert Blocks to New Node', ...tooltip }}
      />

      <SelectionToSnippet
        icon={<Icon height={20} icon={fileAddLine} />}
        tooltip={{ content: 'Convert Blocks to New Snippet', ...tooltip }}
      />
      <ButtonSeparator />
      <LinkButton tooltip={{ content: 'Link', ...tooltip }} icon={<Icon height={20} icon={linkIcon} />} />
      {/* Looses focus when used. */}
    </BalloonToolbar>
  )
}

export interface LinkToolbarButtonProps extends ToolbarButtonProps {
  /**
   * Default onMouseDown is getting the link url by calling this promise before inserting the image.
   */
  getLinkUrl?: (prevUrl: string | null) => Promise<string | null>
}

export default BallonMarkToolbarButtons
