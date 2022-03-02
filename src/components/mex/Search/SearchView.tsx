import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import {
  NoSearchResults,
  Results,
  ResultsWrapper,
  SearchContainer,
  SearchHeader,
  SearchInput
} from '../../../style/Search'
import { Title } from '../../../style/Typography'
import { mog } from '../../../utils/lib/helper'

interface SearchViewState<Item> {
  selected: number
  size: number
  searchTerm: string
  result: Item[]
}

type View = 'list' | 'card'

export interface RenderItemProps<Item> {
  item: Item
  selected: boolean

  ref: RefObject<HTMLDivElement>
  key: string
  onClick: React.MouseEventHandler
}

interface SearchOptions {
  /**
   * Message to display when no results are found
   * Overridden by RenderNotFound if provided
   */
  noResults: string

  /** Message to display in search input */
  inputPlaceholder: string

  /** TODO: Planned features*/

  /** show preview */
  // preview: boolean
  /** animation enabled/disabled */
  // animation: boolean
}

interface SearchViewProps<Item> {
  /**
   * The ID for the view
   */
  id: string
  /**
   * The initial items to display
   */
  initialItems: Item[]

  /** Views to show in search */
  /** If none specified all are used */
  // views?: View[]

  /**
   * Get next resut for current search term
   * @param item Item to render
   * @param index Index of the item
   * @param view View to render
   */
  onSearch: (searchTerm: string) => Item[]

  /**
   * Handle select item
   * @param item - The selected item
   */
  onSelect: (item: Item) => void

  /**
   * Handle select item
   * @param item - The selected item
   */
  getItemKey: (item: Item) => string

  /**
   * When the search term is empty and escape is pressed
   * @param item - The selected item
   */
  onEscapeExit: () => void

  /**
   * Render a single item
   * @param item Item to render
   */
  RenderItem: (props: RenderItemProps<Item>) => JSX.Element

  /**
   * Render a single item
   * @param item Item to render
   */
  RenderNotFound?: () => JSX.Element

  /**
   * Search Options
   */
  options?: Partial<SearchOptions>
}

/**
 * Search Interface
 */
const SearchView = <Item,>({
  id,
  initialItems,
  // views,
  onSearch,
  onSelect,
  onEscapeExit,
  getItemKey,
  RenderItem,
  RenderNotFound,
  options
}: SearchViewProps<Item>) => {
  mog('SearchView', { initialItems, RenderItem, options })

  const [searchState, setSearchState] = useState<SearchViewState<Item>>({
    selected: -1,
    size: 0,
    searchTerm: '',
    result: []
  })

  const { searchTerm, result, selected } = searchState

  const setSelected = (n: number) => {
    setSearchState({ ...searchState, selected: n })
  }

  const setResult = (result: Item[], searchTerm: string) => {
    setSearchState({ ...searchState, result, searchTerm })
  }
  const inpRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  const executeSearch = (newSearchTerm: string) => {
    if (newSearchTerm === '') {
      const res = onSearch(newSearchTerm)
      setResult(res, newSearchTerm)
    } else {
      const res = onSearch(newSearchTerm)
      setResult(res, newSearchTerm)
    }
  }

  // console.log({ result })

  useEffect(() => {
    executeSearch(searchTerm)
    return () => {
      setSelected(-1)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectNext = () => {
    setSelected((selected + 1) % result.length)
    if (selectedRef.current) selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const selectPrev = () => {
    mog('selectPrev', { selected, result, ref: selectedRef.current })
    setSelected((result.length + selected - 1) % result.length)
    if (selectedRef.current) selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    e.preventDefault()
    const inpSearchTerm = e.target.value
    executeSearch(inpSearchTerm)
  }

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Tab') {
      event.preventDefault()
      // Blur the input if necessary (not needed currently)
      // if (inputRef.current) inputRef.current.blur()
      if (event.shiftKey) {
        selectPrev()
      } else {
        selectNext()
      }
    }
    if (event.code === 'Escape') {
      // setInput()
      if (inpRef.current) {
        if (inpRef.current.value !== '') {
          inpRef.current.value = ''
          if (selected > -1) {
            setSelected(-1)
          }
        } else {
          onEscapeExit()
        }
      }
    }
    if (event.code === 'Enter') {
      // Only when the selected index is -1
      if (selected > -1) {
        onSelect(result[selected])
      }
    }
  }

  return (
    <SearchContainer onKeyDown={keyDownHandler}>
      <SearchHeader>
        <Icon icon={searchLine} />
        <SearchInput
          autoFocus
          id={`search_nodes_${id}`}
          name="search_nodes"
          tabIndex={-1}
          placeholder={options?.inputPlaceholder ?? 'Search Anything....'}
          type="text"
          defaultValue={searchTerm}
          onChange={debounce((e) => onChange(e), 250)}
          onFocus={() => {
            if (inpRef.current) inpRef.current.select()
          }}
          ref={inpRef}
        />
      </SearchHeader>
      <ResultsWrapper>
        {result.length > 0 ? (
          <Results>
            {result.map((c, i) => {
              return (
                <RenderItem
                  item={c}
                  onClick={() => {
                    onSelect(c)
                  }}
                  selected={i === selected}
                  ref={i === (selected + 1) % result.length ? selectedRef : null}
                  key={`ResultForSearch_${getItemKey(c)}`}
                />
              )
            })}
          </Results>
        ) : RenderNotFound ? (
          <RenderNotFound />
        ) : (
          <NoSearchResults>
            {options?.noResults ?? 'No results found. Try refining the query or search for a different one.'}
          </NoSearchResults>
        )}
      </ResultsWrapper>
    </SearchContainer>
  )
}

export default SearchView
