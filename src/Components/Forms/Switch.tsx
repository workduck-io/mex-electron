import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'

const SwitchButton = styled.button<{ isActive: boolean; isReadOnly: boolean }>`
  background-color: ${({ theme }) => theme.colors.gray[7]};
  border: none;
  border-radius: 1.5rem;
  display: inline-block;
  vertical-align: middle;
  height: 1.5rem;
  padding: 0 1.25rem;
  position: relative;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.gray[8]};
    box-shadow: ${({ theme }) => transparentize(0.5, theme.colors.primary)} 0 0 0 3px;
  }
  &:focus {
    outline: 0;
    box-shadow: ${({ theme }) => transparentize(0.5, theme.colors.primary)} 0 0 0 3px;
  }
  ${({
    isActive,
    theme: {
      colors: { primary }
    }
  }) =>
    isActive &&
    css`
      ${SwitchIndicator} {
        background-color: ${primary};
        box-shadow: 0px 8px 16px ${transparentize(0.5, primary)};
        left: 1.125rem;
      }
    `}
  ${({ isReadOnly }) =>
    isReadOnly &&
    css`
      ${SwitchIndicator} {
        background-color: #ddd;
        &:hover {
          cursor: not-allowed;
        }
      }
    `}
`
const SwitchIndicator = styled.span`
  background-color: ${({ theme }) => theme.colors.gray[4]};
  border-radius: 50%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
  height: 1.25rem;
  width: 1.25rem;
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  transition: all 200ms ease;
`

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${SwitchButton} {
    margin-left: ${({ theme }) => theme.spacing.small};
  }
  label {
    color: ${({ theme }) => theme.colors.text.default};
  }
`
interface SwitchProps {
  id: string
  label?: string
  showLabel?: boolean
  className?: string
  value?: boolean
  readonly?: boolean
  onChange: (isActive: boolean) => void
}

const Switch = ({
  id,
  label = '',
  className = '',
  value = false,
  readonly = false,
  onChange,
  showLabel = false
}: SwitchProps) => {
  const classes = ['switch', className]

  const [isActive, setIsActive] = useState(value)

  if (isActive) {
    classes.push('switch--active')
  }
  if (readonly) {
    classes.push('switch--readonly')
  }

  function onSwitched () {
    if (readonly === false) {
      setIsActive(!isActive)
      onChange(!isActive)
    }
  }

  const SB = (
    <SwitchButton
      id={id}
      type="button"
      className={classes.join(' ')}
      role="switch"
      isActive={isActive}
      isReadOnly={readonly}
      aria-checked={isActive}
      aria-label={label}
      aria-readonly={readonly}
      onClick={() => onSwitched()}
    >
      <SwitchIndicator className="switch__indicator" />
    </SwitchButton>
  )

  if (showLabel) {
    return (
      <SwitchWrapper>
        <label htmlFor={id}>{label}</label>
        {SB}
      </SwitchWrapper>
    )
  }

  return SB
}

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.bool,
  readonly: PropTypes.bool,
  classes: PropTypes.string
}

export default Switch
