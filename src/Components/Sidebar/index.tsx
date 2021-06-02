import React from 'react';
import links from '../../Conf/links';
import { SidebarContent, SidebarDiv } from '../../Styled/Sidebar';
import TreeNode from '../../Types/tree';
import Nav from './Nav';
import Tree from './Tree';

export type SideBarProps = { tree: TreeNode[]; starred: TreeNode[] };

const SideBar = ({ tree, starred }: SideBarProps) => {
  return (
    <SidebarDiv>
      <Nav links={links} />
      <SidebarContent>
        <h1>Sidebar</h1>
        <h2>Starred</h2>
        <Tree tree={starred} />
        <h2>Tree</h2>
        <Tree tree={tree} />
      </SidebarContent>
    </SidebarDiv>
  );
};

export default SideBar;
