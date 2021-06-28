/* eslint-disable react/jsx-props-no-spreading */

import * as React from 'react';
import { LinkNodeData } from '@udecode/slate-plugins-link';
import {
  getRootClassNames,
  StyledElementProps,
} from '@udecode/slate-plugins-ui-fluent';

// import Icon from '@iconify/react';
// import { EditorIcons } from '../../Icons';

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

  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.metaKey) {
      // Only open the link if meta key is pressed
      window.open(element.url);
    }
  };

  return (
    <a
      {...attributes}
      href={element.url}
      className={classNames.root}
      onClick={openLink}
      {...nodeProps}
    >
      {/* <span>
        <Icon icon={EditorIcons.externalLink} />
      </span> */}
      {children}
    </a>
  );
};

export default LinkElement;
