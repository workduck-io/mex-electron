import boldIcon from '@iconify-icons/ri/bold';
import italicIcon from '@iconify-icons/ri/italic';
import underlineIcon from '@iconify-icons/ri/underline';
import Icon from '@iconify/react';
import {
  ELEMENT_LINK,
  getAbove,
  getPlatePluginType,
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
} from '@udecode/plate';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import styled from 'styled-components';
import { HeadlessButton } from '../../Styled/Buttons';
import { BalloonToolbar } from './BalloonToolbar';
// import { BalloonToolbar } from './xBalloonToolbar/BalloonToolbar';

const LinkButtonStyled = styled.div`
  user-select: all;
  form {
    display: flex;
    align-items: center;
    ${HeadlessButton} {
      color: inherit;
    }
    input {
      background: ${({ theme }) => theme.colors.background.card};
      border: 1px solid ${({ theme }) => theme.colors.gray.s3};
      color: ${({ theme }) => theme.colors.text.secondary};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
    }
  }
`;

interface LinkButtonProps extends ToolbarLinkProps {
  setSelected: (selected: boolean) => void;
}

export const LinkButton = ({ getLinkUrl, setSelected, ...props }: LinkButtonProps) => {
  const editor = useStoreEditorState(useEventEditorId('focus'));

  const type = getPlatePluginType(editor, ELEMENT_LINK);
  const isLink = !!editor?.selection && someNode(editor, { match: { type } });
  const [inp, setInp] = useState({
    prev: '',
  });

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

  useEffect(() => {
    if (!editor) return;
    const linkNode = getAbove(editor, {
      match: { type },
    });
    if (inp.prev === '' && linkNode) {
      setInp({
        prev: linkNode[0].url as string,
      });
    }
  }, [editor, inp.prev, type]);

  const onSubmitLink = async () => {
    if (!editor) return;

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
      setInp({
        prev: linkNode[0].url as string,
      });
    }
    // console.log(inp);

    let url = '';
    if (getLinkUrl) {
      const tempUrl = await getLinkUrl(inp.prev);
      if (tempUrl) {
        url = tempUrl;
      }
    } else {
      // Get url from user
      const val = getValues();
      // console.log({ val });

      if (val['link-input']) url = val['link-input'];
    }

    if (inp.prev) {
      if (linkNode && editor.selection)
        unwrapNodes(editor, {
          at: editor.selection,
          match: { type: getPlatePluginType(editor, ELEMENT_LINK) },
        });

      return;
    }

    // If our cursor is in middle of a link, then we don't want to inser it inline
    const shouldWrap: boolean = linkNode !== undefined && isCollapsed(editor.selection);
    upsertLinkAtSelection(editor, { url, wrap: shouldWrap });

    setSelected(false);
  };

  const onSubmit = async (data: any) => {
    console.log(data); // eslint-disable-line no-console
    await onSubmitLink();
  };

  const { icon } = props;

  return (
    <LinkButtonStyled className="button_of_link">
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeadlessButton
          active={isLink.toString()}
          as={undefined as any}
          // onMouseDown={handleMouseDownLink}
          type="submit"
          // tooltip={{ interactive: true }}
          {...props}
        >
          {icon}
        </HeadlessButton>
        <input defaultValue={inp.prev} type="text" {...register('link-input')} />
      </form>
    </LinkButtonStyled>
  );
};

const BallonToolbarMarks = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));
  // const [selected, setSelected] = useState(false);

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

  return (
    <BalloonToolbar
      direction={direction}
      hiddenDelay={hiddenDelay}
      theme={theme}
      arrow={arrow}
      // selected={selected}
    >
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon height={20} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon height={20} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_UNDERLINE)}
        icon={<Icon height={20} icon={underlineIcon} />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />

      {/* <LinkButton
        tooltip={{ content: 'Link', ...tooltip }}
        icon={<Icon height={20} icon={linkIcon} />}
        setSelected={setSelected}
      /> */}
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
