import React from 'react'
// import { styled, keyframes } from '@stitches/react'
// import { violet, mauve, blackA } from '@radix-ui/colors';
// import { DotFilledIcon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import styled, { css } from 'styled-components'
import { mix } from 'polished'

/*
 * See https://www.radix-ui.com/docs/primitives/components/context-menu
 * for styling
 * */

// const StyledContent = styled(ContextMenuPrimitive.Content, {
//   minWidth: 220,
//   backgroundColor: 'white',
//   borderRadius: 6,
//   overflow: 'hidden',
//   padding: 5,
//   boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)'
// })

export const ContextMenuContent = styled(ContextMenuPrimitive.Content)`
  min-width: 140px;
  background-color: ${({ theme }) => mix(0.5, theme.colors.gray[8], theme.colors.gray[7])};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
`

// const itemStyles = {
//   all: 'unset',
//   fontSize: 13,
//   lineHeight: 1,
//   // color: violet.violet11,
//   borderRadius: 3,
//   display: 'flex',
//   alignItems: 'center',
//   height: 25,
//   padding: '0 5px',
//   position: 'relative',
//   paddingLeft: 25,
//   userSelect: 'none',
//   '&[data-disabled]': {
//     // color: mauve.mauve8,
//     pointerEvents: 'none'
//   },
//   '&:focus': {
//     // backgroundColor: violet.violet9,
//     // color: violet.violet1,
//   }
// }
// const StyledItem = styled(ContextMenuPrimitive.Item, { ...itemStyles })

export const ContextMenuItem = styled(ContextMenuPrimitive.Item)<{ color?: string }>`
  font-size: 14px;
  line-height: 1;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  display: flex;
  align-items: center;
  gap: 5px;
  height: 25px;
  padding: 0px 5px;
  position: relative;
  padding-left: 5px;
  user-select: none;
  color: ${({ theme }) => theme.colors.text.default};

  &:focus,
  &:hover {
    background-color: ${({ theme }) => mix(0.5, theme.colors.gray[8], theme.colors.gray[9])};
    ${({ color }) =>
      !color &&
      css`
        color: ${({ theme }) => theme.colors.text.heading};
        svg {
          color: ${({ theme }) => theme.colors.primary};
        }
      `}
  }
  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    pointer-events: none;
  }

  ${({ color }) =>
    color &&
    css`
      color: ${color};
      svg {
        fill: ${color};
      }
    `}
`

// const StyledSeparator = styled(ContextMenuPrimitive.Separator, {
//   height: 1,
//   // backgroundColor: violet.violet6,
//   margin: 5
// })

export const ContextMenuSeparator = styled(ContextMenuPrimitive.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  margin: 5px;
`
// const StyledCheckboxItem = styled(ContextMenuPrimitive.CheckboxItem, { ...itemStyles })
// const StyledRadioItem = styled(ContextMenuPrimitive.RadioItem, { ...itemStyles })
// const StyledTriggerItem = styled(ContextMenuPrimitive.TriggerItem, {
//   '&[data-state="open"]': {
//     // backgroundColor: violet.violet4,
//     // color: violet.violet11,
//   },
//   // ...itemStyles
// })

// const StyledLabel = styled(ContextMenuPrimitive.Label, {
//   paddingLeft: 25,
//   fontSize: 12,
//   lineHeight: '25px'
//   // color: mauve.mauve11,
// })

// const StyledItemIndicator = styled(ContextMenuPrimitive.ItemIndicator, {
//   position: 'absolute',
//   left: 0,
//   width: 25,
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyContent: 'center'
// })

// Exports
// export const ContextMenu = ContextMenuPrimitive.Root
// export const ContextMenuTrigger = ContextMenuPrimitive.Trigger
// export const ContextMenuContent = StyledContent
// export const ContextMenuItem = StyledItem
// export const ContextMenuCheckboxItem = StyledCheckboxItem
// export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
// export const ContextMenuRadioItem = StyledRadioItem
// export const ContextMenuItemIndicator = StyledItemIndicator
// export const ContextMenuTriggerItem = StyledTriggerItem
// export const ContextMenuLabel = StyledLabel
// export const ContextMenuSeparator = StyledSeparator
