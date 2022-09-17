import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
import { StyledInput, StyledSearch } from './styled'
import { useSaveChanges, useSearchProps } from './useSearchProps'

import { CenterIcon } from '../../../style/spotlight/layout'
import Message from '../Message'
import { useContentStore } from '../../../store/useContentStore'
import { useDebouncedCallback } from 'use-debounce'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useTheme } from 'styled-components'
import { withoutContinuousDelimiter } from '../../../utils/lib/helper'
import { useRouting } from '../../../views/routes/urls'
import ViewActionHandler from '../ActionStage/Forms/ViewActionHandler'
import { useActionStore } from '../Actions/useActionStore'
import { useActionMenuStore } from '../ActionStage/ActionMenu/useActionMenuStore'
import { getIconType, ProjectIconMex } from '../ActionStage/Project/ProjectIcon'
import { StyledCreatatbleSelect } from '@style/Form'
import useDataStore from '@store/useDataStore'
import { useNamespaces } from '@hooks/useNamespaces'
import { mog } from '@workduck-io/mex-utils'
import { StyledNamespaceSpotlightSelectComponents } from '@style/Select'
import NamespaceTag from '@components/mex/NamespaceTag'
import { useSpotlightEditorStore } from '@store/editor.spotlight'

type QueryType = {
  value: string
  type: CategoryType
}

const Search = () => {
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()

  // * Searched query
  const input = useSpotlightAppStore((store) => store.input)
  const setInput = useSpotlightAppStore((store) => store.setInput)

  // * For showing toast message on right
  const saved = useContentStore((store) => store.saved)

  // * Editor's mode (normal/edit)
  const isActionMenuOpen = useActionMenuStore((store) => store.isActionMenuOpen)
  const normalMode = useSpotlightAppStore((s) => s.normalMode)
  const view = useActionStore((store) => store.view)

  const { saveIt } = useSaveChanges()
  const { location } = useRouting()
  const { icon, placeholder } = useSearchProps()
  const { setSearch, search, activeIndex, searchResults, selectedNamespace, setSelectedNamespace } =
    useSpotlightContext()
  const editorNode = useSpotlightEditorStore((store) => store.node)
  const isActionSearch = location.pathname === '/action'

  const { getNamespaceOptions, getNamespace } = useNamespaces()

  const handleSearchInput = useDebouncedCallback((value: string) => {
    // * based on value of input, set search category type

    const query: QueryType = isActionSearch ? { value: value.trim(), type: CategoryType.performed } : getQuery(value)

    setSearch(query)
  }, 150)

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

    if (!normalMode || view === 'item') setInput('')

    ref.current.focus()
  }, [search, normalMode, view, activeIndex])

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

  const disabled = !normalMode || !!view || isActionMenuOpen
  const { mexIcon } = getIconType((icon as string) ?? 'codicon:circle-filled')

  const { namespaceOptions, defaultNamespace } = getNamespaceOptions()

  // The current item should be create new and there should be some input value

  const currentActiveItem = searchResults[activeIndex]
  const showNamespaceSelect = currentActiveItem?.extras.new && input.length > 0
  const selectedNsItem = selectedNamespace ? namespaceOptions.find((ns) => ns.id === selectedNamespace) : undefined
  const activeNamespace = selectedNsItem ?? defaultNamespace

  const selectNamespace = (selected) => {
    setSelectedNamespace(selected.id)
    if (ref.current) {
      ref.current.focus()
    }
  }

  mog('spotlight', {
    input,
    placeholder,
    editorNode
  })

  return (
    <StyledSearch id="wd-mex-spotlight-search-container">
      <CenterIcon id="wd-mex-search-left-icon" pointer={!normalMode} onClick={onBackClick}>
        <ProjectIconMex isMex={mexIcon} color={theme.colors.primary} size={20} icon={icon as string} />
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
      {!normalMode && editorNode.namespace && <NamespaceTag namespace={getNamespace(editorNode.namespace)} />}
      {showNamespaceSelect && (
        <StyledCreatatbleSelect
          onKeyDown={(e) => {
            // Stop the spotlight window from getting up down events
            // Tab switches to input and back
            e.stopPropagation()
          }}
          onChange={(selected) => {
            // mog('Selected', selected)
            selectNamespace(selected)
          }}
          value={activeNamespace}
          options={namespaceOptions}
          closeMenuOnSelect={true}
          closeMenuOnBlur={false}
          components={StyledNamespaceSpotlightSelectComponents}
        />
      )}
      {saved && <Message text="Saved" />}
      <CenterIcon id="wd-mex-spotlight-logo">
        <ViewActionHandler />
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
