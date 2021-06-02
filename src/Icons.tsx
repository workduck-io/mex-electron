import starLine from '@iconify-icons/ri/star-line';
import bxChevronDownCircle from '@iconify-icons/bx/bx-chevron-down-circle';
import checkboxBlankCircleLine from '@iconify-icons/ri/checkbox-blank-circle-line';
import checkboxBlankCircleFill from '@iconify-icons/ri/checkbox-blank-circle-fill';
import starFill from '@iconify-icons/ri/star-fill';

// Disabled as `IconifyIcon` type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const MexIcons: { [key: string]: [any, any] } = {
  openClose: [checkboxBlankCircleFill, bxChevronDownCircle],
  circle: [checkboxBlankCircleFill, checkboxBlankCircleLine],
  pursuits: [starFill, starLine],
  starred: [starFill, starLine],
};

export default MexIcons;
