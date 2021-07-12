import { Toolbar } from '@udecode/slate-plugins';
import {
  useEventEditorId,
  useStoreEditorState,
} from '@udecode/slate-plugins-core';
import { PortalBody } from '@udecode/slate-plugins-ui-fluent';
import * as React from 'react';
import { getBalloonToolbarStyles } from './BalloonToolbar.styles';
import { BalloonToolbarProps } from './BalloonToolbar.types';
import { useBalloonMove } from './useBalloonMove';
import { useBalloonShow } from './useBalloonShow';

export const BalloonToolbar = ({
  className,
  styles,
  children,
  selected,
  hiddenDelay = 0,
  direction = 'top',
  theme = 'dark',
  arrow = false,
}: BalloonToolbarProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const editor = useStoreEditorState(useEventEditorId('focus'));

  const [hidden] = useBalloonShow({ editor, ref, hiddenDelay, selected });
  useBalloonMove({ editor, ref, direction });

  return (
    <PortalBody>
      <Toolbar
        ref={ref}
        styles={getBalloonToolbarStyles(
          className,
          styles,
          theme,
          hidden,
          hiddenDelay,
          direction,
          arrow
        )}
      >
        {children}
      </Toolbar>
    </PortalBody>
  );
};
