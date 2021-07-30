import { Toolbar } from '@udecode/plate';
import { useEventEditorId, useStoreEditorState } from '@udecode/plate-core';
import { PortalBody } from '@udecode/plate-styled-components';
import * as React from 'react';
import { BalloonToolbarProps } from './BalloonToolbar.types';
import { useBalloonMove } from './useBalloonMove';
import { useBalloonShow } from './useBalloonShow';

export const BalloonToolbar = ({
  children,
  selected,
  hiddenDelay = 0,
  direction = 'top',
}: BalloonToolbarProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const editor = useStoreEditorState(useEventEditorId('focus'));

  const [hidden] = useBalloonShow({ editor, ref, hiddenDelay, selected });
  useBalloonMove({ editor, ref, direction });

  return (
    <PortalBody>
      <Toolbar hidden={hidden} ref={ref}>
        {children}
      </Toolbar>
    </PortalBody>
  );
};
