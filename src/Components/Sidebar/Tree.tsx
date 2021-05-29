import React, { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import MexIcons from '../../Icons';
import {
  NodeChildren,
  SIcon,
  Title,
  TreeChild,
  TreeIndicator,
  TreeNode,
} from '../../Styled/Sidebar';
import { darkTheme } from '../../Styled/themes';
import { BlockTree } from '../../Types/tree';
/* 
npm install --save-dev @iconify/react @iconify-icons/ri
*/

type TreeProps = {
  tree: BlockTree;
  level: number;
  id: string;
  accent?: string;
};

const Tree = ({ tree, id, level, accent }: TreeProps) => {
  const shouldCollapse = tree.children.length !== 0;
  const [collapsed, setCollapsed] = useState(
    level <= 1 ? !shouldCollapse : true
    // Expand all level 0 and 1 trees by default
  );

  const themeCtx = useContext(ThemeContext);
  const AccentColor = accent ?? themeCtx.colors.primary;

  // Icons

  const collapsedIndicatorIcon = collapsed
    ? MexIcons.closeTree
    : MexIcons.openTree;
  const collapsedIcon = tree.icon
    ? MexIcons[tree.icon]
    : collapsedIndicatorIcon;
  const defaultIcon = MexIcons.defaultFile;

  const toggleCollapsed = () => {
    if (shouldCollapse) {
      setCollapsed(() => !collapsed);
    }
  };

  return (
    <TreeChild
      key={tree.id}
      id={id}
      level={level}
      className="TreeChild"
      accent={AccentColor}
    >
      <TreeNode
        collapsed={collapsed}
        accent={AccentColor}
        onClick={toggleCollapsed}
        level={level}
      >
        <SIcon
          icon={shouldCollapse ? collapsedIcon : defaultIcon}
          width="20px"
          height="20px"
        />
        <Title>{tree.title}</Title>
      </TreeNode>
      <NodeChildren collapsed={collapsed} level={level} accent={AccentColor}>
        <TreeIndicator onClick={toggleCollapsed}>
          <div className="line" />
        </TreeIndicator>

        {/* Subtree */}
        <div className="subtree">
          {tree.children.length > 0 &&
            !collapsed &&
            tree.children.map((c) => (
              <Tree
                tree={c}
                key={`TREE_${level}_${c.id}`}
                id={`TREE_${level}_${c.id}`}
                level={level + 1}
                accent={AccentColor}
              />
            ))}
        </div>
      </NodeChildren>
    </TreeChild>
  );
};

Tree.defaultProps = {
  accent: darkTheme.colors.primary,
};
export default Tree;
