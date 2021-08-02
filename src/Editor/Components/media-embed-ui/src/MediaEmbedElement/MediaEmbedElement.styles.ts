import { createStyles } from '@udecode/plate-styled-components';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';
import { MediaEmbedElementProps } from './MediaEmbedElement.types';

export const getMediaEmbedElementStyles = (props: MediaEmbedElementProps) =>
  createStyles(
    { prefixClassNames: 'MediaEmbedElement', ...props },
    {
      root: tw`relative`,
      iframeWrapper: [tw`relative`, tw`padding[75% 0 0 0]`],
      iframe: [tw`absolute top-0 left-0 w-full h-full`],
      input: [
        tw`w-full`,
        css`
          padding: 0.5em;
          font-size: 0.85em;
          border: 2px solid #ddd;
          background: #fafafa;
          margin-top: 5px;
        `,
      ],
    }
  );

interface IFrameWrapperProps {
  expand: boolean;
}
export const IFrameWrapper = styled.div<IFrameWrapperProps>`
  position: relative;
  transition: padding 0.2s ease-in-out;

  padding: ${({ expand }) => (expand ? `75% 0 0 0` : `50% 0 0 0`)};
`;

export const RootElement = styled.div`
  position: relative;
`;

export const IFrame = styled.iframe`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

// Input

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: 0.85rem;

  margin-top: ${({ theme }) => theme.borderRadius.small};

  background: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.secondary};

  :focus-within {
    background: ${({ theme }) => theme.colors.background.card};
  }
`;

export const InputPrompt = styled.div`
  display: flex;
  align-items: center;
  max-width: 4rem;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`;

export const MediaInput = styled.input`
  width: 100%;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  padding-left: 0;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: none;

  border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};

  :focus {
    background-color: ${({ theme }) => theme.colors.background.card};
    outline: none;
  }
`;
