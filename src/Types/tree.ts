import MexIcons from '../Icons';

export interface BlockTree {
  title: string;
  id: string;
  path: string;
  icon?: keyof typeof MexIcons;
  children: BlockTree[];
}
