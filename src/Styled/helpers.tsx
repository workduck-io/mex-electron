import { css } from 'styled-components';
import { Pixels } from '../styled';

export const PixelToCSS = (x: Pixels): string => {
  return `${String(x)}px`;
};

export const ThinScrollbar = css`
  scrollbar-color: dark;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gray.s4};
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.app};
  }
`;
