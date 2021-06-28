import {
  createSlatePluginsComponents,
  ELEMENT_LINK,
  withProps,
} from '@udecode/slate-plugins';
import LinkElement from './Link';

const components = createSlatePluginsComponents({
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a',
  }),
});

export default components;
