import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import create from 'zustand'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import {
  NoSearchResults,
  Results,
  ResultsWrapper,
  SearchContainer,
  SearchHeader,
  SearchInput,
  SearchPreviewWrapper,
  InputWrapper
} from '../../../style/Search'
import { Title } from '../../../style/Typography'
import SplitView, { RenderSplitProps, SplitOptions, SplitType } from '../../../ui/layout/splitView'
import { mog } from '../../../utils/lib/helper'
import ViewSelector, { View } from './ViewSelector'

interface SearchViewState<Item> {
  selected: number
  searchTerm: string
  result: Item[]
  view: View
}

export interface RenderPreviewProps<Item> extends RenderSplitProps {
  item?: Item
}

export interface RenderItemProps<Item> {
  item: Item
  selected: boolean

  view: View
  ref: RefObject<HTMLDivElement>
  key: string
  onClick: React.MouseEventHandler
}

export interface SearchViewStoreState<Item> extends SearchViewState<Item> {
  setSelected: (selected: number) => void
  setResult: (result: Item[], searchTerm: string) => void
  setView: (view: View) => void
}

const useSearchStoreBase = create<SearchViewStoreState<unknown>>((set) => ({
  selected: -1,
  searchTerm: '',
  result: [],
  view: View.List,
  setSelected: (selected: number) => set({ selected }),
  setView: (view: View) => set({ view }),
  setResult: (result, searchTerm) => set({ result, searchTerm })
}))

export const useSearchStore = <Item, Slice>(selector: (state: SearchViewStoreState<Item>) => Slice) =>
  useSearchStoreBase(selector)

interface SearchOptions {
  /**
   * Message to display when no results are found
   * Overridden by RenderNotFound if provided
   */
  noResults: string

  /** Message to display in search input */
  inputPlaceholder: string

  /** TODO: Planned features*/

  splitOptions: SplitOptions
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
   * @param item - Item to render
   */
  RenderItem: (props: RenderItemProps<Item>) => JSX.Element

  /**
   * Render Preview of the selected item in list view
   * @param item - Selected Item
   */
  RenderPreview?: (props: RenderPreviewProps<Item>) => JSX.Element

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
  RenderPreview,
  RenderNotFound,
  options
}: SearchViewProps<Item>) => {
  const selected = useSearchStore((s) => s.selected)
  const searchTerm = useSearchStore((s) => s.searchTerm)
  const result = useSearchStore((s) => s.result) as Item[]
  const view = useSearchStore((s) => s.view)
  const setSelected = useSearchStore((s) => s.setSelected)
  const setResult = useSearchStore((s) => s.setResult)
  const setView = useSearchStore((s) => s.setView)
  const inpRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setResult(initialItems, '')
  }, [])

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

  useEffect(() => {
    if (selectedRef.current) selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [selected])

  const selectNext = () => {
    setSelected((selected + 1) % result.length)
  }

  const selectPrev = () => {
    const newSelected = (result.length + selected - 1) % result.length
    // mog('selectPrev', { selected, result, newSelected })
    setSelected(newSelected)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    e.preventDefault()
    const inpSearchTerm = e.target.value
    executeSearch(inpSearchTerm)
  }

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    mog('keyDownHandler', { code: event.code })
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
    if (event.code === 'ArrowDown') {
      event.preventDefault()
      selectNext()
    }
    if (event.code === 'ArrowUp') {
      event.preventDefault()
      selectPrev()
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
        onSelect(result[selected] as Item)
      }
    }
  }

  const ResultsView = (
    <Results view={view}>
      {result.map((c, i) => {
        // if (i === selected) mog('selected', { c, i })
        return (
          <RenderItem
            view={view}
            item={c}
            onClick={() => {
              onSelect(c)
            }}
            selected={i === selected}
            ref={i === selected ? selectedRef : null}
            key={`ResultForSearch_${getItemKey(c)}`}
          />
        )
      })}
    </Results>
  )

  return (
    <SearchContainer onKeyDown={keyDownHandler}>
      <SearchHeader>
        <InputWrapper>
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
        </InputWrapper>
        <ViewSelector
          currentView={view}
          onChangeView={(view) => {
            mog('onChangeView', { view })
            setView(view)
          }}
        />
      </SearchHeader>
      <ResultsWrapper>
        {result.length > 0 ? (
          view === View.List ? (
            <SplitView
              RenderSplitPreview={(props) => (
                <RenderPreview {...props} item={selected > -1 ? result[selected] : undefined} />
              )}
              splitOptions={
                options?.splitOptions ?? {
                  type: selected > -1 ? SplitType.SIDE : SplitType.NONE,
                  percent: 50
                }
              }
            >
              {ResultsView}
            </SplitView>
          ) : (
            ResultsView
          )
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
