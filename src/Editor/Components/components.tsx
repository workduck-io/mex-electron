import {
  createSlatePluginsComponents,
  ELEMENT_LINK,
  withProps,
} from '@udecode/slate-plugins';
import { ILinkElement } from './ilink/components/ILinkElement';
import { ELEMENT_ILINK } from './ilink/defaults';
import LinkElement from './Link';
import { TagElement } from './tag/components/TagElement';
import { ELEMENT_TAG } from './tag/defaults';

const components = createSlatePluginsComponents({
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a',
  }),
  [ELEMENT_TAG]: TagElement as any,
  [ELEMENT_ILINK]: ILinkElement as any,
});

export default components;
