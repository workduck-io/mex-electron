import React, { forwardRef, useEffect, useState } from 'react'

import styled, { useTheme } from 'styled-components'
import { components, StylesConfig } from 'react-select'
import { StyledSelect } from '../../../../style/Form'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import { StyledBackground } from '../../styled'
import { getIconType, ProjectIconMex } from '../Project/ProjectIcon'
import { transparentize } from 'polished'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'

const Dropdown = styled.div`
  ${StyledBackground}
  font-size: 1rem;
  border-radius: 10px;
  flex: 1;
  border: none;
  color: ${({ theme }) => theme.colors.text.fade};
  :focus {
    outline: none;
  }
`

type SelectedProps = {
  value?: any
  data?: any
  isMulti?: boolean
  width?: string
  disabled?: boolean
  actionId: string
  onChange?: any
  placeholder?: string
  error?: any
  actionGroupId: string
}

export const SelectBar = styled(StyledSelect)`
  flex: 1;
  max-width: ${({ width }) => width || '30%'};
  font-size: 0.9rem;
  margin: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};

  & > div {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin: 0.5rem 0 0;
    border: none;
  }
`

const StyledOption = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-right: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    border-radius: 50%;
    padding: 2px;
    background-color: ${({ theme }) => theme.colors.background.card};
  }

  div {
    margin: 0;
  }

  font-size: 0.9rem;
`

// eslint-disable-next-line react/prop-types

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
  const setIsMenuOpen = useSpotlightAppStore((store) => store.setIsMenuOpen)
  const { actionId, placeholder, onChange, width = '30%', actionGroupId, data, value, isMulti } = props
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
  const prevSelelectedLabel = getPreviousActionValue(actionId)?.selection

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
  }, [actionId, actionGroupId, prevSelelectedLabel])

  const handleChange = (selection: any) => {
    if (onChange) onChange(selection)

    const val = { prev: prevSelelectedLabel?.label, selection }
    addSelectionInCache(actionId, val)
  }

  return (
    <SelectBar
      openMenuOnClick
      menuShouldScrollIntoView
      placeholder={placeholder}
      onMenuOpen={() => setIsMenuOpen(true)}
      onMenuClose={() => setIsMenuOpen(false)}
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
