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
}: {
  url: string;
  onChange: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setExpand: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
  const [value, setValue] = React.useState(url);

  const validateUrl = (newUrl: string) => {
    let resultUrl = newUrl;
    // if not starting with http, assume pasting of full iframe embed code
    if (newUrl.substring(0, 4) !== 'http') {
      const regexMatchSrc = /src=".*?"/;
      const regexGroupQuotes = /"([^"]*)"/;

      const src = newUrl.match(regexMatchSrc)?.[0];
      const returnString = src?.match(regexGroupQuotes)?.[1];

      if (returnString) {
        resultUrl = returnString;
      }
    }
    return resultUrl;
  };

  return (
    <InputWrapper>
      <InputPrompt
        onClick={() => {
          setExpand((i: boolean) => !i);
        }}
      >
        <Icon icon={globalLine} height={18} />
      </InputPrompt>
      <MediaInput
        data-testid="MediaEmbedUrlInput"
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const newUrl = e.target.value;
          validateUrl(newUrl);
          setValue(newUrl);
          onChange(newUrl);
        }}
      />
    </InputWrapper>
  );
};
