import { PlatePlugin } from '@udecode/plate'
import BlockOptions from '.'

export const createBlockModifierPlugin = (): PlatePlugin => ({
  key: 'BLOCK_MODIFIER_PLUGIN',
  inject: {
    aboveComponent: () => BlockOptions
  }
})
