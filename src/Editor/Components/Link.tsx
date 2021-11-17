import { Icon } from '@iconify/react'
import { LinkNodeData } from '@udecode/plate-link'
import { StyledElementProps } from '@udecode/plate-styled-components'
import React from 'react'
import styled from 'styled-components'
import { EditorIcons } from '../../Icons'

const Link = styled.a`
  .LinkIcon {
    position: relative;
    cursor: pointer;
    background: ${({ theme }) => theme.colors.background.card};
    vertical-align: middle;
    padding: 2px 4px 0px;
    margin-right: ${({ theme }) => theme.spacing.tiny};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    border: none;
    svg {
      color: ${({ theme }) => theme.colors.text.subheading};
    }
  }

  .link-tooltip {
    position: absolute;
    z-index: 1000;
    display: none;
    bottom: -2.5rem;
    padding: 2px ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    background: ${({ theme }) => theme.colors.gray[8]};
    box-shadow: 0px 2px 5px #00000080;
  }

  &:hover {
    .LinkIcon svg {
      color: ${({ theme }) => theme.colors.primary};
    }

    .link-tooltip {
      display: inherit;
    }
  }
`

const getSanatizedLink = (raw: string) => {
  if (raw.includes('://')) {
    return raw
  } else {
    return `https://${raw}`
  }
}

/**
 * LinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
const LinkElement = ({ attributes, children, element, nodeProps }: StyledElementProps<LinkNodeData>) => {
  const isExternal = element.url.startsWith('#')

  const openLink = (e: React.MouseEvent, meta: boolean) => {
    e.preventDefault()
    if (isExternal) {
      return
    }
    if (meta) {
      if (e.metaKey) {
        // Only open the link if meta key is pressed
        window.open(getSanatizedLink(element.url))
      }
    } else {
      window.open(getSanatizedLink(element.url))
    }
  }

  return (
    <Link
      {...attributes}
      href={element.url}
      onClick={(e) => {
        openLink(e, true)
      }}
      {...nodeProps}
    >
      <div className="link-tooltip" contentEditable={false}>
        {element.url}
      </div>
      {!isExternal && (
        <button
          className="LinkIcon"
          type="button"
          aria-label="Open link"
          onClick={(e) => {
            openLink(e, false)
          }}
          data-tip={element.url}
          data-class="nav-tooltip"
          contentEditable={false}
        >
          <Icon icon={EditorIcons.externalLink} />
        </button>
      )}

      {children}
    </Link>
  )
}

export default LinkElement
