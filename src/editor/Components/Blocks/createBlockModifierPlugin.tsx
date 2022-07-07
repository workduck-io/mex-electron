import { PlatePlugin } from '@udecode/plate'
import SourceInfo from './SourceInfo'

export const SOURCE_PLUGIN = 'BLOCK_MODIFIER_PLUGIN'

export const createBlockModifierPlugin = (): PlatePlugin => ({
  key: SOURCE_PLUGIN,
  inject: {
    aboveComponent: () => SourceInfo
  }
})
