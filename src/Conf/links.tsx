import fileDocument from '@iconify-icons/gg/file-document';
import appsLine from '@iconify-icons/ri/apps-line';
import checkboxLine from '@iconify-icons/ri/checkbox-line';
import dashboardLine from '@iconify-icons/ri/dashboard-line';
import quillPenLine from '@iconify-icons/ri/quill-pen-line';
import { Icon } from '@iconify/react';
import React from 'react';
import { NavLinkData } from '../Components/Nav';

/*
Sidebar links are defined here
*/

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
  {
    title: 'Tasks',
    path: '/tasks',
    icon: getIcon(checkboxLine),
  },
  {
    title: 'Integrations',
    path: '/integrations',
    icon: getIcon(appsLine),
  },
  {
    title: 'Snippets',
    path: '/snippets',
    icon: getIcon(quillPenLine),
  },
];

export default links;
