import fileDocument from '@iconify-icons/gg/file-document';
import dashboardLine from '@iconify-icons/majesticons/dashboard-line';
import { Icon } from '@iconify/react';
import React from 'react';
import { NavLinkData } from '../Components/Nav';

const getIcon = (icon: any): React.ReactNode => <Icon width="32" icon={icon} />;

const links: NavLinkData[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: getIcon(dashboardLine),
  },
  {
    title: 'Editor',
    path: '/editor',
    icon: getIcon(fileDocument),
  },
];

export default links;
