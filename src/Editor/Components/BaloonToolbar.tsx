import boldIcon from '@iconify-icons/ri/bold';
import italicIcon from '@iconify-icons/ri/italic';
import underlineIcon from '@iconify-icons/ri/underline';
import Icon from '@iconify/react';
import {
  BalloonToolbar,
  ELEMENT_LINK,
  getAbove,
  getSlatePluginType,
  isCollapsed,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  someNode,
  ToolbarButton,
  ToolbarButtonProps,
  ToolbarMark,
  unwrapNodes,
  upsertLinkAtSelection,
  useEventEditorId,
  useStoreEditorRef,
  useStoreEditorState,
} from '@udecode/slate-plugins';
import React, { useState } from 'react';
import linkIcon from '@iconify-icons/ri/link';
import { MouseEventHandler } from 'react';
import { useForm } from 'react-hook-form';
const LinkButton = ({ getLinkUrl, ...props }: ToolbarLinkProps) => {
  const editor = useStoreEditorState(useEventEditorId('focus'));

  const type = getSlatePluginType(editor, ELEMENT_LINK);
  const isLink = !!editor?.selection && someNode(editor, { match: { type } });

  const [showInput, setShowInput] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  const handleMouseDownLink: MouseEventHandler<HTMLSpanElement> = async (
    event
  ) => {
    if (!editor) return;

    event.preventDefault();
    setShowInput(true);
  };

  const onSubmitLink = async () => {
    if (!editor) return;

    // return;
    let prevUrl = '';

    const linkNode = getAbove(editor, {
      match: { type },
    });
    if (linkNode) {
      prevUrl = linkNode[0].url as string;
    }
    console.log(prevUrl);

    let url: string = '';
    if (getLinkUrl) {
      let _url = await getLinkUrl(prevUrl);
      if (_url) {
        url = _url;
      }
    } else {
      // Get url from user
      url = 'https://xypnox.com';
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
  };

  return (
    <>
      <button
        active={isLink}
        onMouseDown={handleMouseDownLink}
        // tooltip={{ interactive: true }}
        {...props}
      >
        {props.icon}
      </button>
      {showInput && <input {...register('link_value')} />}
    </>
  );
};

const BallonToolbarMarks = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  const arrow = false;
  const theme = 'dark';
  const direction = 'top';
  const hiddenDelay = 0;
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0] as [number, number],
    hideOnClick: false,
    offset: [0, 17] as [number, number],
    placement: 'top' as const,
  };

  return (
    <BalloonToolbar
      direction={direction}
      hiddenDelay={hiddenDelay}
      theme={theme}
      arrow={arrow}
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
