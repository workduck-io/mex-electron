/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import SearchIcon from '@iconify-icons/ph/magnifying-glass-bold'
import Document from '@iconify-icons/gg/file-document'
import { Icon } from '@iconify/react'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { StyledSearch, StyledInput } from './styled'
import { CenterIcon } from '../../../style/spotlight/layout'
import WDLogo from './Logo'
import { useTheme } from 'styled-components'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useSpotlightAppStore } from '../../../store/app.spotlight'

const Search: React.FC = () => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()
  const { setSearch, search, selection } = useSpotlightContext()

  const node = useSpotlightEditorStore((s) => s.node)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)

  const handleSearchInput = useDebouncedCallback((value: string) => {
    setSearch(value)
    // if (!value) {
    //   setIsPreview(false)
    // }
  }, 400)

  useEffect(() => {
    if (search === '') ref.current.value = ''
    // ref.current.focus()
    // if (normalMode) ref.current.value = ''
  }, [search, normalMode])

  return (
    <StyledSearch>
      <CenterIcon>
        <Icon
          color={theme.colors.primary}
          height={24}
          width={24}
          icon={!normalMode || selection ? Document : SearchIcon}
        />
      </CenterIcon>
      <StyledInput
        ref={ref}
        autoFocus={true}
        id="spotlight_search"
        name="spotlight_search"
        placeholder={!normalMode || selection ? node?.title : 'Search anything...'}
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
