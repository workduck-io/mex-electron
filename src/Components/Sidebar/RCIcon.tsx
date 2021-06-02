import circleOutline from '@iconify-icons/codicon/circle-outline';
import React from 'react';
import MexIcons from '../../Icons';
import { SIcon } from '../../Styled/Sidebar';
import TreeNode from '../../Types/tree';

interface RCIconProps {
  data: TreeNode;
  expanded: boolean;
}

// eslint-disable-next-line
const getIcon = (collapsed: boolean, array: [any, any]): any => {
  return collapsed ? array[0] : array[1];
};

const RCIcon = ({ data, expanded }: RCIconProps) => {
  const canCollapse = data.children.length > 0;
  const collapsed = !expanded;
  const customIcon = data.mex_icon;
  const defaultIcon = circleOutline;

  const collapsedIndicatorIcon = MexIcons.openClose;

  const collapsedIcon = canCollapse
    ? getIcon(collapsed, collapsedIndicatorIcon)
    : defaultIcon;

  const icon = customIcon
    ? getIcon(collapsed, MexIcons[customIcon])
    : collapsedIcon;

  return <SIcon icon={icon} width="16px" height="16px" />;
};

export default RCIcon;
