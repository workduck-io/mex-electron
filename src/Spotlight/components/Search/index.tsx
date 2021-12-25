/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import SearchIcon from '@iconify-icons/ph/magnifying-glass-bold'
import Document from '@iconify-icons/gg/file-document'
import { Icon } from '@iconify/react'
import { useSpotlightContext } from '../../utils/context'
import { StyledSearch, StyledInput } from './styled'
import { CenterIcon } from '../../styles/layout'
import WDLogo from './Logo'
import { useTheme } from 'styled-components'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'

const Search: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()
  const { setSearch, search, editSearchedNode, selection } = useSpotlightContext()

  const setIsPreview = useSpotlightEditorStore((state) => state.setIsPreview)

  const handleSearchInput = useDebouncedCallback((value: string) => {
    setSearch(value)
    // if (!value) {
    //   setIsPreview(false)
    // }
  }, 400)

  useEffect(() => {
    if (search === '' || editSearchedNode) ref.current.value = ''
  }, [search, editSearchedNode])

  return (
    <StyledSearch>
      <CenterIcon>
        <Icon
          color={theme.colors.primary}
          height={24}
          width={24}
          icon={editSearchedNode || selection ? Document : SearchIcon}
        />
      </CenterIcon>
      <StyledInput
        ref={ref}
        autoFocus
        id="spotlight_search"
        name="spotlight_search"
        placeholder={editSearchedNode || selection ? editSearchedNode?.text : 'Search anything...'}
        onChange={({ target: { value } }) => {
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
