import { ReactEditor } from 'slate-react'
import { QuickLinkType } from '../../../../components/mex/NodeSelect/NodeSelect'
import { SlashType } from '../../multi-combobox/types'

export interface RenderFunction<P = { [key: string]: any }> {
  (props: P, defaultRender?: (props?: P) => JSX.Element | null): JSX.Element | null
}

export enum ComboboxItemType {
  Normal = 0,
  Divider = 1,
  Header = 2
}

export interface IComboboxItem {
  /**
   * Arbitrary string associated with this option.
   */
  key: string

  /**
   * Text to render for this option
   */
  text: any

  /**
   * Text to render for this option
   */
  itemType?: ComboboxItemType

  type?: QuickLinkType | SlashType

  /**
   * Icon to be rendered
   */
  icon?: string

  /**
   * Icon to be rendered on the right
   */
  rightIcons?: string[]

  /**
   * description text if any
   */
  desc?: string

  prefix?: string

  /**
   * Whether the option is disabled
   * @defaultvalue false
   */
  disabled?: boolean

  /**
   * Extedned
   * @defaultvalue false
   */
  extended?: boolean

  /**
   * Data available to onRenderItem / onExtendedAction.
   */
  data?: unknown
}

export interface ComboboxItemProps {
  item: IComboboxItem
}

export interface ComboboxProps {
  isSlash?: boolean
  onSelectItem: (editor: ReactEditor, item: string) => void
  onRenderItem?: RenderFunction<ComboboxItemProps>
}
