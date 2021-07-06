/* eslint-disable react/jsx-props-no-spreading */

import Icon from '@iconify/react';
import { LinkNodeData } from '@udecode/slate-plugins-link';
import {
  getRootClassNames,
  StyledElementProps,
} from '@udecode/slate-plugins-ui-fluent';
import * as React from 'react';
import styled from 'styled-components';

import { EditorIcons } from '../../Icons';

const Link = styled.a`
  span.LinkIcon {
    vertical-align: middle;
    margin-right: ${({ theme }) => theme.spacing.tiny};
  }
`;

const getClassNames = getRootClassNames();

/**
 * LinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
const LinkElement = ({
  attributes,
  children,
  element,
  styles,
  className,
  nodeProps,
}: StyledElementProps<LinkNodeData>) => {
  const classNames = getClassNames(styles, {
    className,
  });
  const isExternal = element.url.startsWith('#');

  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternal) {
      return;
    }
    if (e.metaKey) {
      // Only open the link if meta key is pressed
      window.open(element.url);
    }
  };

  return (
    <Link
      {...attributes}
      href={element.url}
      className={classNames.root}
      onClick={openLink}
      {...nodeProps}
    >
      {!isExternal && (
        <span className="LinkIcon">
          <Icon icon={EditorIcons.externalLink} />
        </span>
      )}
      {children}
    </Link>
  );
};

export default LinkElement;
