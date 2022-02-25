import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
import { StyledInput, StyledSearch } from './styled'

import { CenterIcon } from '../../../style/spotlight/layout'
import { Icon } from '@iconify/react'
import Message from '../Message'
import WDLogo from './Logo'
import { useContentStore } from '../../../store/useContentStore'
import { useDebouncedCallback } from 'use-debounce'
import { useSearchProps } from './useSearchProps'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useTheme } from 'styled-components'

const Search: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()
  const { setSearch, search } = useSpotlightContext()
  const input = useSpotlightAppStore((store) => store.input)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const saved = useContentStore((store) => store.saved)
  const setCurrentListItem = useSpotlightEditorStore((store) => store.setCurrentListItem)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  const handleSearchInput = useDebouncedCallback((value: string) => {
    const query = {
      value: value.trim(),
      type: CategoryType.search
    }

    if (value.startsWith('[[')) {
      query.type = CategoryType.quicklink
    }

    if (value.startsWith('/')) {
      query.type = CategoryType.action
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
        autoFocus={normalMode}
        value={input}
        disabled={!normalMode}
        id="spotlight_search"
        name="spotlight_search"
        placeholder={placeholder}
        onChange={({ target: { value } }) => {
          const val = value.replace(/^\.|\.$/g, '')
          setInput(value)
          handleSearchInput(val)
        }}
      />
      {saved && <Message text="Saved" />}
      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
