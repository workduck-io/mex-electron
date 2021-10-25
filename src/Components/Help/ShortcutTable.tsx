import React, { useEffect, useMemo, useState } from 'react'
import useShortcutTableData from './useShortcutTableData'
import Modal from 'react-modal'
import { matchSorter } from 'match-sorter'
import { Shortcut } from './Help.types'
import { debounce, sortBy } from 'lodash'
import { Input } from '../../Styled/Form'
import {
  StyledRow,
  StyledTable,
  StyledTBody,
  StyledTD,
  StyledTH,
  StyledTHead,
  TableHeader,
  TableWrapperScrollable
} from './ShortcutTable.styles'
import { useShortcutStore } from '../../Editor/Store/ShortcutStore'
import InputShortcut from './InputShortcut'

function fuzzyTextFilterFn (data: Shortcut[], search: any) {
  return matchSorter(data, search, { keys: ['title', 'keystrokes', 'category'] })
}

const ShowShortcut = (keybinding: string, mod = '⌘') => {
  return keybinding.replaceAll('$mod', mod).replaceAll('Key', '')
}

const ShortcutTable = () => {
  const { data, columns } = useShortcutTableData()

  const [tableData, setTableData] = useState(data)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setEditMode(false)
    if (search) setTableData(fuzzyTextFilterFn(data, search))
    else setTableData(data)
  }, [search, data])

  const editMode = useShortcutStore((state) => state.editMode)
  const setEditMode = useShortcutStore((state) => state.setEditMode)

  return (
    <>
      <TableHeader>
        <h1>Shortcuts</h1>
        <Input
          autoFocus
          type="text"
          placeholder="Search...."
          onChange={debounce((e) => setSearch(e.target.value), 250)}
        />
      </TableHeader>

      <TableWrapperScrollable>
        <StyledTable>
          <StyledTHead>
            {
              <StyledRow>
                {columns.map((column) => (
                  <StyledTH key={`THeader_${column.Header}`}> {column.Header} </StyledTH>
                ))}
              </StyledRow>
            }
          </StyledTHead>

          <StyledTBody>
            {tableData.map((row) => {
              return (
                <StyledRow key={`Row_${row.title}`}>
                  {Object.keys(row).map((cell, index) => {
                    // console.log(cell)

                    if (cell === 'keystrokes') {
                      return (
                        <StyledTD key={`cell_${index}_${row[cell]}`} onClick={() => setEditMode(true)}>
                          {ShowShortcut(row[cell])}
                        </StyledTD>
                      )
                    }
                    return <StyledTD key={`cell_${index}_${row[cell]}`}>{row[cell]}</StyledTD>
                  })}
                </StyledRow>
              )
            })}
          </StyledTBody>
        </StyledTable>
        <Modal
          className="ModalContent"
          overlayClassName="ModalOverlay"
          onRequestClose={() => setEditMode(false)}
          isOpen={editMode}
        >
          <InputShortcut />
        </Modal>
      </TableWrapperScrollable>
    </>
  )
}

export default ShortcutTable
