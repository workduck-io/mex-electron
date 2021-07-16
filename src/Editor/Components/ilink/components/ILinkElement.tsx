import * as React from 'react';
import { getRootClassNames, useEditorRef } from '@udecode/slate-plugins';
import { styled } from '@uifabric/utilities';
import { Transforms } from 'slate';
import { useFocused, useSelected } from 'slate-react';
import { useHotkeys } from '../hooks/useHotkeys';
import { useOnMouseClick } from '../hooks/useOnMouseClick';
import { getILinkElementStyles } from './ILinkElement.styles';
import {
  ILinkElementProps,
  ILinkElementStyleProps,
  ILinkElementStyleSet,
} from './ILinkElement.types';

const getClassNames = getRootClassNames<
  ILinkElementStyleProps,
  ILinkElementStyleSet
>();

/**
 * ILinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const ILinkElementBase = ({
  attributes,
  children,
  element,
  styles,
  className,
}: ILinkElementProps) => {
  const editor = useEditorRef();
  const selected = useSelected();
  const focused = useFocused();

  const onClickProps = useOnMouseClick(() => console.info('ILink clicked'));

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor);
      }
    },
    [selected, focused]
  );
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor, { reverse: true });
      }
    },
    [selected, focused]
  );

  const classNames = getClassNames(styles, {
    className,
    // Other style props
    selected,
    focused,
  });

  return (
    <div
      {...attributes}
      data-slate-value={element.value}
      className={classNames.root}
      contentEditable={false}
    >
      <div className={`${classNames.link}`} {...onClickProps}>
        #{element.value}
      </div>
      {children}
    </div>
  );
};

/**
 * ILinkElement
 */
export const ILinkElement = styled<
  ILinkElementProps,
  ILinkElementStyleProps,
  ILinkElementStyleSet
>(ILinkElementBase, getILinkElementStyles, undefined, {
  scope: 'ILinkElement',
});
