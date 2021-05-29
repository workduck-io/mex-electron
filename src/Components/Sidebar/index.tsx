import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import links from '../../Conf/links';
import { SidebarContent, SidebarDiv } from '../../Styled/Sidebar';
import { BlockTree } from '../../Types/tree';
import Nav from './Nav';
import Tree from './Tree';

export type SideBarProps = { tree: BlockTree; starred: BlockTree };

const SideBar = ({ tree, starred }: SideBarProps) => {
  const themeCtx = useContext(ThemeContext);
  return (
    <SidebarDiv>
      <Nav links={links} />
      <SidebarContent>
        <h1>Sidebar</h1>
        <Tree
          tree={starred}
          accent={themeCtx.colors.palette.yellow}
          id="sidebar_starred"
          level={0}
        />

        <Tree
          tree={tree}
          id="sidebar_tree"
          accent={themeCtx.colors.secondary}
          level={0}
        />
      </SidebarContent>
    </SidebarDiv>
  );
};

export default SideBar;
