export interface NavLinkData {
  path: string;
  title: string;
  icon?: React.ReactNode;
}

export type NavProps = {
  links: NavLinkData[];
};
