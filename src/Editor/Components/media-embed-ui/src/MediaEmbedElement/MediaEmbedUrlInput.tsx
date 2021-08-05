import magicLine from '@iconify-icons/ri/magic-line';
import globalLine from '@iconify-icons/ri/global-line';
// npm install --save-dev @iconify/react @iconify-icons/ri
import { Icon } from '@iconify/react';
import * as React from 'react';
import {
  InputPrompt,
  InputWrapper,
  MediaInput,
} from './MediaEmbedElement.styles';

export const MediaEmbedUrlInput = ({
  url,
  onChange,
  setExpand,
  htmlData,
}: {
  url: string;
  onChange: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setExpand: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  htmlData: string | undefined;
}) => {
  const [value, setValue] = React.useState(url);

  return (
    <InputWrapper>
      <InputPrompt
        onClick={() => {
          setExpand((i: boolean) => !i);
        }}
      >
        {htmlData ? (
          <Icon icon={magicLine} height={18} />
        ) : (
          <Icon icon={globalLine} height={18} />
        )}
      </InputPrompt>
      <MediaInput
        data-testid="MediaEmbedUrlInput"
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const newUrl = e.target.value;
          setValue(newUrl);
          onChange(newUrl);
        }}
      />
    </InputWrapper>
  );
};
