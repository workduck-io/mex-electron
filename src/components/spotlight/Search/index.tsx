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
import { withoutContinuousDelimiter } from '../../../utils/lib/helper'

type QueryType = {
  value: string
  type: CategoryType
}

const Search: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()
  const { setSearch, search, activeIndex } = useSpotlightContext()
  const input = useSpotlightAppStore((store) => store.input)
  const setInput = useSpotlightAppStore((store) => store.setInput)
  const saved = useContentStore((store) => store.saved)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)

  const { saveIt } = useSaveChanges()
  const handleSearchInput = useDebouncedCallback((value: string) => {
    const query: QueryType = getQuery(value)

    setSearch(query)
  }, 200)

  const getQuery = (value: string): QueryType => {
    const query: QueryType = {
      value: value.trim(),
      type: CategoryType.search
    }

    if (value.startsWith('[[')) {
      query.type = CategoryType.quicklink
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

  const { icon, placeholder } = useSearchProps()

  const onBackClick = () => {
    if (!normalMode) {
      saveIt()
    }
  }

  const type = getQuery(input).type
  const before = type === CategoryType.search ? '' : type

  return (
    <StyledSearch>
      <CenterIcon cursor={!normalMode} onClick={onBackClick}>
        <Icon color={theme.colors.primary} height={24} width={24} icon={icon} />
      </CenterIcon>
      <Before before={before}>
        <StyledInput
          ref={ref}
          disabled={!normalMode}
          autoFocus={normalMode}
          value={input}
          id="spotlight_search"
          name="spotlight_search"
          placeholder={placeholder}
          onChange={({ target: { value } }) => {
            const { key } = withoutContinuousDelimiter(value)

            const query = key.startsWith('.') ? key.substring(1) : key

            const dots = new RegExp(/\.{2,}/g)
            const replaceContinousDots = value.replace(dots, '.') // * replace two or more dots with one dot

            setInput(replaceContinousDots)
            handleSearchInput(query)
          }}
        />
      </Before>
      {saved && <Message text="Saved" />}
      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
