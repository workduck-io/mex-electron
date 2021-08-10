import { ReactNode } from 'react';
import { StyledProps } from '@udecode/plate-styled-components';

export interface BalloonToolbarProps extends StyledProps<BalloonToolbarStyleProps> {
  children: ReactNode;

  /**
   * When selecting characters, the balloon is hidden for a delay.
   * If 0, the balloon is never hidden.
   */
  hiddenDelay?: number;

  /**
   * Below of above the selection.
   */
  direction?: 'top' | 'bottom';

  /**
   * Color theme for the background/foreground.
   */
  theme?: 'dark' | 'light';

  /**
   * Set the selected state without focus.
   */
  selected?: boolean;

  /**
   * Show an arrow pointing to up or down depending on the direction.
   */
  arrow?: boolean;
}

export interface BalloonToolbarStyleProps {
  hidden?: boolean;
  hiddenDelay?: BalloonToolbarProps['hiddenDelay'];
  direction?: BalloonToolbarProps['direction'];
  theme?: BalloonToolbarProps['theme'];
  arrow?: BalloonToolbarProps['arrow'];
}
