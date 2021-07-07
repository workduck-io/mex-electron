import boldIcon from '@iconify-icons/ri/bold';
import italicIcon from '@iconify-icons/ri/italic';
import underlineIcon from '@iconify-icons/ri/underline';
import Icon from '@iconify/react';
import {
  BalloonToolbar,
  getSlatePluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  ToolbarMark,
  useEventEditorId,
  useStoreEditorRef,
} from '@udecode/slate-plugins';
import React from 'react';

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
    </BalloonToolbar>
  );
};

export default BallonToolbarMarks;
