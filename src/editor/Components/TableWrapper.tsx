import {
  Popover,
  TableElement,
  TableElementProps,
  TableToolbarButton,
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  deleteTable
} from '@udecode/plate'
import styled, { useTheme } from 'styled-components'

import AddColumnIcon from '@iconify-icons/fluent/table-stack-right-20-filled'
import AddRowIcon from '@iconify-icons/fluent/table-stack-down-20-filled'
import { ButtonSeparator } from '../../style/Toolbar'
import DeleteColumnIcon from '@iconify-icons/fluent/table-delete-column-20-filled'
import DeleteRowIcon from '@iconify-icons/fluent/table-delete-row-20-filled'
import DeleteTableIcon from '@iconify-icons/fluent/delete-20-filled'
import { MexIcon } from '../../style/Layouts'
import React from 'react'

const JustifyCenter = styled.div<{ width: string; height: string }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => props.width};
  height: ${(props) => props.height};
`

const TableToolbarButtons = () => {
  const theme = useTheme()
  return (
    <>
      <TableToolbarButton icon={<MexIcon icon={AddRowIcon} />} transform={addRow} />
      <TableToolbarButton icon={<MexIcon icon={AddColumnIcon} />} transform={addColumn} />
      <TableToolbarButton icon={<MexIcon icon={DeleteRowIcon} />} transform={deleteRow} />
      <TableToolbarButton icon={<MexIcon icon={DeleteColumnIcon} />} transform={deleteColumn} />
      <JustifyCenter width="1rem" height="inherit">
        <ButtonSeparator />
      </JustifyCenter>
      <TableToolbarButton
        icon={<MexIcon color={theme.colors.primary} icon={DeleteTableIcon} />}
        transform={deleteTable}
      />
    </>
  )
}

export const TableModal = ({ element, popoverProps, children }: TableElementProps) => (
  <Popover content={<TableToolbarButtons />} {...popoverProps}>
    {children}
  </Popover>
)

const TableWrapper = (props: any) => {
  return <TableElement {...props} onRenderContainer={TableModal} id="hello" />
}

export default TableWrapper
