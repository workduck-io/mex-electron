import organizationChart from '@iconify-icons/ri/organization-chart';
import starLine from '@iconify-icons/ri/star-line';
import bxChevronDownCircle from '@iconify-icons/bx/bx-chevron-down-circle';
import bxCaretRightCircle from '@iconify-icons/bx/bx-caret-right-circle';
import circleOutline from '@iconify-icons/codicon/circle-outline';

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const MexIcons: { [key: string]: any } = {
  tree: organizationChart,
  starred: starLine,
  defaultFile: circleOutline,
  openTree: bxChevronDownCircle,
  closeTree: bxCaretRightCircle,
};

export default MexIcons;
