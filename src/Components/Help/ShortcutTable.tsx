import React, { useEffect, useState } from 'react'
import useShortcutTableData from './useShortcutTableData'
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
  TableHeader
} from './ShortcutTable.styles'

function fuzzyTextFilterFn (data: Shortcut[], search: any) {
  return matchSorter(data, search, { keys: ['title', 'keystrokes', 'category'] })
}

const ShortcutTable = () => {
  const { data, columns } = useShortcutTableData()

  const [tableData, setTableData] = useState(data)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setTableData(sortBy(fuzzyTextFilterFn(data, search), ['category', 'title']))
  }, [search, data])

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
                  return <StyledTD key={`cell_${index}_${row[cell]}`}>{row[cell]}</StyledTD>
                })}
              </StyledRow>
            )
          })}
        </StyledTBody>
      </StyledTable>
    </>
  )
}

export default ShortcutTable
