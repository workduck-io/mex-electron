import React from 'react'
import { Icon } from '@iconify/react'
import checkboxBlankCircleLine from '@iconify-icons/radix-icons/drag-handle-dots-2'
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  withDraggables
} from '@udecode/plate'

import Tippy, { TippyProps } from '@tippyjs/react'
import styled from 'styled-components'
import { ELEMENT_SYNC_BLOCK } from '../Components/SyncBlock'
import { ELEMENT_INLINE_BLOCK } from '../Components/InlineBlock/types'
import { ELEMENT_ILINK } from '../Components/ilink/defaults'

const StyledTip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.fade};
  /* background-color: ${({ theme }) => theme.colors.background.card}; */
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
`

const GrabberTooltipContent = () => <StyledTip>Drag to move</StyledTip>

export const grabberTooltipProps: TippyProps = {
  content: <GrabberTooltipContent />,
  placement: 'left',
  arrow: false,
  delay: [300, 0],
  followCursor: true,
  duration: [0, 0],
  hideOnClick: true,
  theme: 'small'
}

export const withStyledDraggables = (components: any) => {
  return withDraggables(components, [
    {
      keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
      level: 0
    },
    {
      keys: [
        ELEMENT_PARAGRAPH,
        ELEMENT_BLOCKQUOTE,
        ELEMENT_TODO_LI,
        ELEMENT_H1,
        ELEMENT_H2,
        ELEMENT_H3,
        ELEMENT_H4,
        ELEMENT_H5,
        ELEMENT_H6,
        ELEMENT_IMAGE,
        ELEMENT_OL,
        ELEMENT_UL,
        ELEMENT_SYNC_BLOCK,
        ELEMENT_INLINE_BLOCK,
        ELEMENT_ILINK,
        ELEMENT_TABLE,
        ELEMENT_MEDIA_EMBED,
        ELEMENT_CODE_BLOCK
      ],
      onRenderDragHandle: ({ className, styles }) => {
        return (
          <Tippy {...grabberTooltipProps}>
            <StyledTip className={className} css={styles}>
              <Icon icon={checkboxBlankCircleLine} />
            </StyledTip>
          </Tippy>
        )
      }
    },
    {
      key: ELEMENT_H1,
      styles: {
        gutterLeft: {
          padding: '3em 4px 4px'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      key: ELEMENT_H2,
      styles: {
        gutterLeft: {
          padding: '1em 4px 1px',
          fontSize: '1.5em'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      key: ELEMENT_H3,
      styles: {
        gutterLeft: {
          padding: '1em 1px',
          fontSize: '1.25em'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      keys: [ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
      styles: {
        gutterLeft: {
          padding: '1em 4px 0',
          fontSize: '1.1em'
        },
        blockToolbarWrapper: {
          height: '1.3em'
        }
      }
    },
    {
      keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
      styles: {
        gutterLeft: {
          padding: '2px 4px 0'
        }
      }
    },
    {
      key: ELEMENT_BLOCKQUOTE,
      styles: {
        gutterLeft: {
          padding: '18px 4px 0'
        }
      }
    },
    {
      key: ELEMENT_CODE_BLOCK,
      styles: {
        gutterLeft: {
          padding: '12px 4px 0'
        }
      }
    }
  ])
}
