import { getRenderElement, getSlatePluginTypes } from '@udecode/slate-plugins';
import { SlatePlugin } from '@udecode/slate-plugins-core';
import { ELEMENT_ILINK } from './defaults';
import { getILinkDeserialize } from './getILinkDeserialize';

/**
 * Enables support for Internal links.
 */
export const createILinkPlugin = (): SlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_ILINK),
  deserialize: getILinkDeserialize(),
  inlineTypes: getSlatePluginTypes(ELEMENT_ILINK),
  voidTypes: getSlatePluginTypes(ELEMENT_ILINK),
});
