import { Icon } from '@iconify/react';
import { LinkNodeData } from '@udecode/plate-link';
import { StyledElementProps } from '@udecode/plate-styled-components';
import * as React from 'react';
import styled from 'styled-components';

import { EditorIcons } from '../../Icons';

const Link = styled.a`
  .LinkIcon {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.background.card};
    vertical-align: middle;
    padding: 2px 4px 0px;
    margin-right: ${({ theme }) => theme.spacing.tiny};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    border: none;
    svg {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  &:hover {
    .LinkIcon svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

/**
 * LinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
const LinkElement = ({ attributes, children, element, nodeProps }: StyledElementProps<LinkNodeData>) => {
  const isExternal = element.url.startsWith('#');

  const openLink = (e: React.MouseEvent, meta: boolean) => {
    e.preventDefault();
    if (isExternal) {
      return;
    }
    if (meta) {
      if (e.metaKey) {
        // Only open the link if meta key is pressed
        window.open(element.url);
      }
    } else {
      window.open(element.url);
    }
  };

  return (
    <Link
      {...attributes}
      href={element.url}
      onClick={e => {
        openLink(e, true);
      }}
      {...nodeProps}
    >
      {!isExternal && (
        <button
          className="LinkIcon"
          type="button"
          aria-label="Open link"
          onClick={e => {
            openLink(e, false);
          }}
          contentEditable={false}
        >
          <Icon icon={EditorIcons.externalLink} />
        </button>
      )}
      {children}
    </Link>
  );
};

export default LinkElement;
