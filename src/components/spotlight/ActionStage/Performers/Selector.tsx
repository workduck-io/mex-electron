import React, { forwardRef, useEffect, useState } from 'react'

import { useTheme } from 'styled-components'
import { components } from 'react-select'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import { getIconType, ProjectIconMex } from '../Project/ProjectIcon'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import ListSelector from '../ActionMenu/ListSelector'
import { StyledOption, SelectBar } from './styled'
import VirtualList from '../ActionMenu/VirtualList'
import { mog } from '@utils/lib/helper'

type SelectedProps = {
  value?: any
  data?: any
  isMulti?: boolean
  width?: string
  disabled?: boolean
  actionId: string
  isList?: boolean
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
  const icon = props?.data?.value?.select?.icon
  const color = props?.data?.value?.select?.color

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
  const { actionId, isList, placeholder, onChange, width = '30%', actionGroupId, data, value, isMulti } = props

  const setIsMenuOpen = useSpotlightAppStore((store) => store.setIsMenuOpen)
  const [inputValue, setInputValue] = useState<{ data: Array<any>; value?: any }>({
    data: [],
    value: null
  })

  useEffect(() => {
    setInputValue({ data, value })
  }, [data, value])

  const addSelectionInCache = useActionStore((store) => store.addSelectionInCache)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)

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

  useEffect(() => {
    const isReady = isPerformer(actionId)

    if (isReady) {
      performer(actionGroupId, actionId).then((res) => {
        const result = res?.contextData
        const data = resToDisplay(result)

        setInputValue({ data, value: null })
      })
    }
  }, [actionId, actionGroupId, prevSelection])

  const handleChange = (selection: any) => {
    if (onChange) onChange(selection)

    const prev = prevSelection?.label
    const val = { prev, selection }

    addSelectionInCache(actionId, val)
  }

  if (isList) {
    return (
      <VirtualList
        items={inputValue?.data ?? []}
        activeItems={inputValue?.value ?? []}
        getIsActive={(item, activeItems) => {
          return Array.isArray(activeItems)
            ? activeItems?.find((i) => i.label === item?.label)
            : activeItems.label === item.label
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
      placeholder={placeholder}
      onMenuOpen={() => setIsMenuOpen(true)}
      onMenuClose={() => setIsMenuOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.stopPropagation()
        }
      }}
      onSelect={(e) => e.stopImmediatePropagation()}
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
