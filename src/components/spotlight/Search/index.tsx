/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { SearchType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { StyledSearch, StyledInput } from './styled'
import { CenterIcon } from '../../../style/spotlight/layout'
import WDLogo from './Logo'
import { useTheme } from 'styled-components'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSearchProps } from './useSearchProps'
import { Icon } from '@iconify/react'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'

const Search: React.FC = () => {
  const ref = useRef<HTMLInputElement>()
  const theme = useTheme()
  const { setSearch, search } = useSpotlightContext()
  const input = useSpotlightAppStore((store) => store.input)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  const handleSearchInput = useDebouncedCallback((value: string) => {
    const query = {
      value: value.trim(),
      type: SearchType.search
    }

    if (value.startsWith('[[')) {
      query.type = SearchType.quicklink
    }

    if (value.startsWith('/')) {
      query.type = SearchType.action
    }

    if (value === '') setCurrentListItem(null)
    setSearch(query)
  }, 200)

  useEffect(() => {
    if (search.value === '') {
      ref.current.value = ''
    }
    ref.current.focus()
  }, [search, normalMode])

  const { icon, placeholder } = useSearchProps()

  return (
    <StyledSearch>
      <CenterIcon>
        <Icon color={theme.colors.primary} height={24} width={24} icon={icon} />
      </CenterIcon>
      <StyledInput
        ref={ref}
        autoFocus
        value={input}
        id="spotlight_search"
        name="spotlight_search"
        placeholder={placeholder}
        onChange={({ target: { value } }) => {
          setInput(value)
          handleSearchInput(value)
        }}
      />
      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
