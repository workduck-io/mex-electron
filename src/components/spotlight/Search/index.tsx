import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
import { Before, StyledInput, StyledSearch } from './styled'
import { useSaveChanges, useSearchProps } from './useSearchProps'

import { CenterIcon } from '../../../style/spotlight/layout'
import { Icon } from '@iconify/react'
import Message from '../Message'
import WDLogo from './Logo'
import { useContentStore } from '../../../store/useContentStore'
import { useDebouncedCallback } from 'use-debounce'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useTheme } from 'styled-components'
import { mog, withoutContinuousDelimiter } from '../../../utils/lib/helper'
import { useRouting } from '../../../views/routes/urls'
import Loading from '../../../style/Loading'

type QueryType = {
  value: string
  type: CategoryType
}

const Search: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()

  // * Searched query
  const input = useSpotlightAppStore((store) => store.input)
  const setInput = useSpotlightAppStore((store) => store.setInput)

  // * For showing toast message on right
  const saved = useContentStore((store) => store.saved)

  // * Editor's mode (normal/edit)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const isLoading = useSpotlightAppStore((s) => s.isLoading)

  const { saveIt } = useSaveChanges()
  const { location } = useRouting()
  const { icon, placeholder } = useSearchProps()
  const { setSearch, search, activeIndex } = useSpotlightContext()
  const isActionSearch = location.pathname === '/action'

  const handleSearchInput = useDebouncedCallback((value: string) => {
    // * based on value of input, set search category type

    const query: QueryType = isActionSearch ? { value: value.trim(), type: CategoryType.performed } : getQuery(value)

    setSearch(query)
  }, 200)

  const getQuery = (value: string): QueryType => {
    const query: QueryType = {
      value: value.trim(),
      type: CategoryType.search
    }

    if (value.startsWith('[[')) {
      query.type = CategoryType.backlink
    }

    if (value.startsWith('/')) {
      query.type = CategoryType.action
    }

    return query
  }

  useEffect(() => {
    if (search.value === '') {
      ref.current.value = ''
    }
    if (!normalMode) setInput('')

    ref.current.focus()
  }, [search, normalMode, activeIndex])

  const onBackClick = () => {
    if (!normalMode) {
      saveIt()
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const dots = new RegExp(/\.{2,}/g)
    const replaceContinousDots = value.replace(dots, '.') // * replace two or more dots with one dot

    const key = withoutContinuousDelimiter(replaceContinousDots).key

    const query = key.startsWith('.') || key.startsWith('[[.') ? key.replace('.', '') : key

    setInput(replaceContinousDots)
    handleSearchInput(query)
  }

  // const type = getQuery(input).type
  // const before = type === CategoryType.search ? '' : type

  const disabled = !normalMode

  mog('loading', { isLoading })

  const disabled = !normalMode

  mog('loading', { isLoading })

  return (
    <StyledSearch id="wd-mex-spotlight-search-container">
      <CenterIcon id="wd-mex-search-left-icon" cursor={!normalMode} onClick={onBackClick}>
        <Icon color={theme.colors.primary} height={24} width={24} icon={icon} />
      </CenterIcon>
      {/* <Before before={before} id="wd-mex-spotlight-quick-action-chip"> */}
      <StyledInput
        ref={ref}
        disabled={disabled}
        autoFocus={!disabled}
        value={input}
        id="wd-mex-spotlight-search-input"
        name="spotlight_search"
        placeholder={placeholder}
        onChange={onChange}
      />
      {/* </Before> */}
      {saved && <Message text="Saved" />}
      <CenterIcon id="wd-mex-spotlight-logo">
        {isLoading ? <Loading color={theme.colors.primary} dots={3} transparent /> : <WDLogo />}
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
