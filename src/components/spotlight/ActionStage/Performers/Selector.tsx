import React, { forwardRef, useEffect, useState } from 'react'

import { useTheme } from 'styled-components'
import { components } from 'react-select'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { SelectionNode, useActionStore } from '../../Actions/useActionStore'
import { getIconType, ProjectIconMex } from '../Project/ProjectIcon'
import ListSelector from '../ActionMenu/ListSelector'
import { StyledOption, SelectBar } from './styled'
import VirtualList from '../ActionMenu/VirtualList'
import { mog } from '@utils/lib/helper'
import { findNodePath, getPlateEditorRef, setNodes } from '@udecode/plate'

type SelectedProps = {
  value?: any
  data?: any
  cacheSelection?: boolean
  isMulti?: boolean
  width?: string
  disabled?: boolean
  actionId: string
  isList?: boolean
  defaultValue?: any
  onChange?: any
  placeholder?: string
  error?: any
  actionGroupId: string
}

// * Custom Option for Selector component
export const CustomOption: React.FC<any> = ({ children, ...props }) => {
  const icon = props?.data?.value?.select?.icon
  const color = props?.data?.value?.select?.color

  const { mexIcon } = getIconType(icon ?? 'codicon:circle-filled')
  const theme = useTheme()

  return (
    <components.Option {...props}>
      <StyledOption>
        <span>
          <ProjectIconMex
            isMex={mexIcon}
            size={16}
            color={color ?? theme.colors.secondary}
            icon={icon ?? 'codicon:circle-filled'}
          />
        </span>
        <div>{children}</div>
      </StyledOption>
    </components.Option>
  )
}

export const SingleValue: React.FC<any> = ({ children, ...props }) => {
  const selected = props?.data?.value?.select

  const icon = selected?.icon || props?.data?.icon
  const color = selected?.color || props?.data?.color

  const { mexIcon } = getIconType(icon ?? 'codicon:circle-filled')
  const theme = useTheme()

  return (
    <components.SingleValue {...props}>
      <StyledOption>
        <span>
          <ProjectIconMex
            isMex={mexIcon}
            size={16}
            color={color ?? theme.colors.secondary}
            icon={icon ?? 'codicon:circle-filled'}
          />
        </span>
        <div>{children}</div>
      </StyledOption>
    </components.SingleValue>
  )
}

export const MultiValueOption: React.FC<any> = (props) => {
  const icon = props?.data?.value?.select?.icon
  const color = props?.data?.value?.select?.color

  const { mexIcon } = getIconType(icon ?? 'codicon:circle-filled')

  const theme = useTheme()

  return (
    <components.MultiValue {...props}>
      <StyledOption>
        <ProjectIconMex
          isMex={mexIcon}
          size={16}
          color={color ?? theme.colors.secondary}
          icon={icon ?? 'codicon:circle-filled'}
        />
        <span>{props?.data?.label}</span>
      </StyledOption>
    </components.MultiValue>
  )
}

const Selector = forwardRef<any, SelectedProps>((props, ref) => {
  const {
    actionId,
    isList,
    placeholder,
    onChange,
    cacheSelection,
    width = '30%',
    actionGroupId,
    data,
    value,
    defaultValue,
    isMulti
  } = props

  const setIsMenuOpen = useActionStore((store) => store.setIsMenuOpen)
  const [inputValue, setInputValue] = useState<{ data: Array<any>; value?: any }>({
    data: [],
    value: defaultValue
  })

  useEffect(() => {
    setInputValue({ data, value })
  }, [data, value])

  const addSelectionInCache = useActionStore((store) => store.addSelectionInCache)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)
  const isPerformingAction = useActionStore((store) => store.isLoading)
  const element = useActionStore((store) => store.element)

  const { performer, isPerformer } = useActionPerformer()
  const prevSelection = getPreviousActionValue(actionId)?.selection

  const resToDisplay = (result) => {
    return result?.map((item) => {
      const displayItem = item.select
      return {
        label: displayItem?.label,
        value: item
      }
    })
  }

  const onReadyPerform = (actionGroupId: string, actionId: string, value?: any) => {
    performer(actionGroupId, actionId).then((res) => {
      const result = res?.contextData
      const data = resToDisplay(result)

      setInputValue({ data, value: value || null })
    })
  }

  useEffect(() => {
    const isReady = isPerformer(actionId, { isMenuAction: isList })

    if (isReady) {
      onReadyPerform(actionGroupId, actionId, defaultValue)
    }
  }, [actionId, actionGroupId, prevSelection])

  const hasChanged = (newValue: any) => {
    if (isMulti) {
      // * In multi-selection, labels can't be same
      return value?.length !== newValue?.length
    }

    return newValue?.label !== value?.label || inputValue?.value !== newValue?.label
  }

  const saveSelectionInNote = (selection: SelectionNode) => {
    const editor = getPlateEditorRef()

    if (editor) {
      const path = findNodePath(editor, element)
      const actionContext = element?.actionContext ?? {}
      const selections = actionContext?.selections ?? {}

      if (element?.actionContext) {
        setNodes(
          editor,
          { actionContext: { ...actionContext, selections: { ...selections, [actionId]: selection } } },
          { at: path }
        )
      }
    }
  }

  const handleChange = (selection: any) => {
    if (!hasChanged(selection)) return

    if (onChange) onChange(selection)

    if (cacheSelection !== false) {
      const prev = prevSelection?.label
      const val = { prev, selection }
      saveSelectionInNote(val)

      addSelectionInCache(actionId, val)
    }
  }

  if (isList) {
    return (
      <VirtualList
        items={inputValue?.data}
        activeItems={inputValue?.value || []}
        isLoading={isPerformingAction}
        getIsActive={(item, activeItems) => {
          return Array.isArray(activeItems)
            ? activeItems?.find((i) => i?.label === item?.label)
            : activeItems?.label === item?.label
        }}
        onEnter={onChange}
        onClick={onChange}
        ItemRenderer={ListSelector}
      />
    )
  }

  return (
    <SelectBar
      openMenuOnClick
      menuShouldScrollIntoView
      contentEditable={false}
      onClick={(ev) => {
        ev.stopPropagation()
      }}
      placeholder={placeholder}
      onMenuOpen={() => {
        onReadyPerform(actionGroupId, actionId, defaultValue || value)
        setIsMenuOpen(true)
      }}
      onMenuClose={() => setIsMenuOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.stopPropagation()
        }
      }}
      // onSelect={(e) => e.stopImmediatePropagation()}
      components={
        isMulti ? { Option: CustomOption, MultiValue: MultiValueOption } : { SingleValue, Option: CustomOption }
      }
      width={width}
      ref={ref}
      error={props.error}
      isMulti={isMulti}
      isDisabled={props.disabled}
      onChange={handleChange}
      value={inputValue.value}
      options={inputValue.data}
    />
  )
})

Selector.displayName = 'Selector'

export default Selector
