/* eslint-disable react/jsx-props-no-spreading */
import Icon from '@iconify/react';
import styled from 'styled-components';
import React from 'react';
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
