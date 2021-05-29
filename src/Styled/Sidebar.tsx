/* eslint-disable react/jsx-props-no-spreading */
import Icon from '@iconify/react';
import styled, { css } from 'styled-components';
import React from 'react';
import { rgba } from 'polished';
import { PixelToCSS, ThinScrollbar } from './helpers';

export const Sicon = styled(Icon)``;
// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const SIcon = (props: any) => {
  return <Sicon {...props} />;
};

export const SidebarDiv = styled.div`
  background-color: ${({ theme }) => theme.colors.background.app};
  position: fixed;
  height: 100%;
  display: flex;
  max-width: ${({ theme }) => PixelToCSS(theme.width.sidebar)};
  width: ${({ theme }) => PixelToCSS(theme.width.sidebar)};
`;

export const SidebarContent = styled.div`
  ${ThinScrollbar};
  flex-grow: 1;
  margin-left: ${({ theme }) => PixelToCSS(theme.width.nav)};
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.medium};
`;

interface NodeChildrenProps {
  collapsed: boolean;
  level: number;
  accent: string;
}

export const TreeNode = styled.div<NodeChildrenProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  width: fit-content;
  /* margin-right: ${({ theme }) => theme.spacing.tiny}; */
  padding: ${({ theme }) =>
    `${theme.spacing.tiny} ${theme.spacing.medium} ${theme.spacing.tiny} ${theme.spacing.tiny}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.background.app} !important;
    background-color: ${({ accent }) => accent} !important;
    box-shadow: 0px 5px 10px  ${({ accent }) => rgba(accent, 0.5)};
    transition: 0s ease-in;
  }
    transition: 0.2s ease-in;
`;

export const TreeIndicator = styled.div``;

export const NodeChildren = styled.div<NodeChildrenProps>`
  display: flex;
  flex-direction: row;
  ${TreeIndicator} {
    display: flex;
    justify-content: center;
    cursor: row-resize;
    width: 20px;
    /* margin: 0 auto; */
    opacity: ${({ level }) => 0.2 + (level % 6) / 8};
    .line {
      width: 2px;
      height: 100%;
      ${({ theme, collapsed }) =>
        collapsed
          ? css`
              opacity: 0;
            `
          : css`
              background-color: ${theme.colors.background.card};
            `}
    }
  }
`;

export const Title = styled.div`
  padding-left: ${({ theme }) => theme.spacing.tiny};
`;

interface TreeChildProps {
  level: number;
  accent: string;
}

export const TreeChild = styled.div<TreeChildProps>`
  display: flex;
  flex-direction: column;
  margin: 2px 0 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease-in-out;

  &:hover > ${NodeChildren} > ${TreeIndicator} .line {
    background-color: ${({ accent }) => accent} !important;
  }

  &:hover > ${TreeNode} {
    color: ${({ accent }) => accent};
  }

  ${Sicon} {
    /* height: 100%; */
    flex-shrink: 0;
  }
`;
