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
import { useEditorStore } from '../../../Store/EditorStore';

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
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId);

  const onClickProps = useOnMouseClick(() => {
    loadNodeFromId(element.value);
  });

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
        <span className="ILink_decoration ILink_decoration_left">[[</span>
        {element.value}
        <span className="ILink_decoration ILink_decoration_right">]]</span>
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
