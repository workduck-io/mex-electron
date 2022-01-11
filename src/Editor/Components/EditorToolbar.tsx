import boldIcon from '@iconify-icons/ri/bold'
import doubleQuotesL from '@iconify-icons/ri/double-quotes-l'
import h1 from '@iconify-icons/ri/h-1'
import h2 from '@iconify-icons/ri/h-2'
import h3 from '@iconify-icons/ri/h-3'
import italicIcon from '@iconify-icons/ri/italic'
import linkIcon from '@iconify-icons/ri/link'
import listOrdered from '@iconify-icons/ri/list-ordered'

import NewTableIcon from '@iconify-icons/fluent/table-add-20-filled'
import AddRowIcon from '@iconify-icons/fluent/table-stack-down-20-filled'
import DeleteTableIcon from '@iconify-icons/fluent/table-dismiss-20-filled'
import DeleteRowIcon from '@iconify-icons/fluent/table-delete-row-20-filled'
import AddColumnIcon from '@iconify-icons/fluent/table-stack-right-20-filled'
import DeleteColumnIcon from '@iconify-icons/fluent/table-delete-column-20-filled'

import listUnordered from '@iconify-icons/ri/list-unordered'
import { Icon } from '@iconify/react'
import {
  addColumn,
  addRow,
  BlockToolbarButton,
  deleteColumn,
  deleteRow,
  deleteTable,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  insertTable,
  ListToolbarButton,
  MarkToolbarButton,
  MARK_BOLD,
  MARK_ITALIC,
  TableToolbarButton,
  ToolbarButtonProps,
  usePlateEditorRef,
  usePlateId
} from '@udecode/plate'
import React from 'react'
import { ButtonSeparator } from '../../Styled/Toolbar'
import { BalloonToolbar } from './BalloonToolbar'
import LinkButton from './BalloonToolbar/LinkButton'

const BallonMarkToolbarButtons = () => {
  const editor = usePlateEditorRef(usePlateId())

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
    <BalloonToolbar direction={direction} hiddenDelay={hiddenDelay} arrow={arrow}>
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

      <TableToolbarButton icon={<Icon icon={NewTableIcon} />} transform={insertTable} />
      <TableToolbarButton icon={<Icon icon={AddRowIcon} />} transform={addRow} />
      <TableToolbarButton icon={<Icon icon={AddColumnIcon} />} transform={addColumn} />
      <TableToolbarButton icon={<Icon icon={DeleteRowIcon} />} transform={deleteRow} />
      <TableToolbarButton icon={<Icon icon={DeleteColumnIcon} />} transform={deleteColumn} />
      <TableToolbarButton icon={<Icon icon={DeleteTableIcon} />} transform={deleteTable} />

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

      {/* Looses focus when used. */}
      <LinkButton tooltip={{ content: 'Link', ...tooltip }} icon={<Icon height={20} icon={linkIcon} />} />
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
