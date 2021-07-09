import boldIcon from '@iconify-icons/ri/bold';
import italicIcon from '@iconify-icons/ri/italic';
import linkIcon from '@iconify-icons/ri/link';
import underlineIcon from '@iconify-icons/ri/underline';
import Icon from '@iconify/react';
import {
  ELEMENT_LINK,
  getAbove,
  getSlatePluginType,
  isCollapsed,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  someNode,
  ToolbarButtonProps,
  ToolbarMark,
  unwrapNodes,
  upsertLinkAtSelection,
  useEventEditorId,
  useStoreEditorRef,
  useStoreEditorState,
} from '@udecode/slate-plugins';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import styled from 'styled-components';
import { BalloonToolbar } from './BalloonToolbar/BalloonToolbar';

const StyledDiv = styled.div`
  user-select: all;
`;

interface LinkButtonProps extends ToolbarLinkProps {
  setSelected: (selected: boolean) => void;
}

const LinkButton = ({ getLinkUrl, setSelected, ...props }: LinkButtonProps) => {
  const editor = useStoreEditorState(useEventEditorId('focus'));

  const type = getSlatePluginType(editor, ELEMENT_LINK);
  const isLink = !!editor?.selection && someNode(editor, { match: { type } });

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    setSelected(true);
    return () => {
      setSelected(false);
    };
  });

  const onSubmitLink = async () => {
    if (!editor) return;

    let prevUrl = '';

    // Blur focus returns
    if (!editor || ReactEditor.isFocused(editor)) return;
    try {
      ReactEditor.focus(editor);
      if (!editor.selection && editor.blurSelection) {
        Transforms.select(editor, editor.blurSelection);
      }
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }

    const linkNode = getAbove(editor, {
      match: { type },
    });
    if (linkNode) {
      prevUrl = linkNode[0].url as string;
    }
    // console.log(prevUrl);

    let url = '';
    if (getLinkUrl) {
      const tempUrl = await getLinkUrl(prevUrl);
      if (tempUrl) {
        url = tempUrl;
      }
    } else {
      // Get url from user
      const val = getValues();
      // console.log({ val });

      if (val['link-input']) url = val['link-input'];
    }

    if (prevUrl) {
      if (linkNode && editor.selection)
        unwrapNodes(editor, {
          at: editor.selection,
          match: { type: getSlatePluginType(editor, ELEMENT_LINK) },
        });

      return;
    }

    // If our cursor is in middle of a link, then we don't want to inser it inline
    const shouldWrap: boolean =
      linkNode !== undefined && isCollapsed(editor.selection);
    upsertLinkAtSelection(editor, { url, wrap: shouldWrap });

    setSelected(false);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    await onSubmitLink();
  };

  const { icon } = props;

  return (
    <StyledDiv className="button_of_link">
      <form onSubmit={handleSubmit(onSubmit)}>
        <button
          active={isLink.toString()}
          // onMouseDown={handleMouseDownLink}
          type="submit"
          // tooltip={{ interactive: true }}
          {...props}
        >
          {icon}
        </button>
        <input type="text" {...register('link-input')} />
      </form>
    </StyledDiv>
  );
};

const BallonToolbarMarks = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));
  const [selected, setSelected] = useState(false);

  const arrow = true;
  const theme = 'dark';
  const direction = 'top';
  const hiddenDelay = 0;
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0] as [number, number],
    // hideOnClick: false,
    offset: [0, 17] as [number, number],
    placement: 'top' as const,
  };
  // const styles = {
  //   root: [
  //     'slate-BalloonToolbar',
  //     {
  //       userSelect: 'all',
  //     },
  //   ],
  // };

  return (
    <BalloonToolbar
      direction={direction}
      hiddenDelay={hiddenDelay}
      theme={theme}
      arrow={arrow}
      // styles={styles}
      selected={selected}
    >
      <ToolbarMark
        type={getSlatePluginType(editor, MARK_BOLD)}
        icon={<Icon height={24} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <ToolbarMark
        type={getSlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon height={24} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <ToolbarMark
        type={getSlatePluginType(editor, MARK_UNDERLINE)}
        icon={<Icon height={24} icon={underlineIcon} />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />
      <LinkButton
        tooltip={{ content: 'Link', ...tooltip }}
        icon={<Icon height={24} icon={linkIcon} />}
        setSelected={setSelected}
      />
    </BalloonToolbar>
  );
};

export interface ToolbarLinkProps extends ToolbarButtonProps {
  /**
   * Default onMouseDown is getting the link url by calling this promise before inserting the image.
   */
  getLinkUrl?: (prevUrl: string | null) => Promise<string | null>;
}
export default BallonToolbarMarks;
