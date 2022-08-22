import { PlateEditor, TElement, Value } from '@udecode/plate'
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

  // Inserted to element if present
  additional?: Record<string, any>

  /**
   * Extedned
   * @defaultvalue false
   */
  extended?: boolean

  /**
   * Data available to onRenderItem / onExtendedAction.
   */
  data?: any
}

export interface ComboboxItemProps {
  item: IComboboxItem
}

export type ComboboxOptions = {
  showPreview?: boolean
}

export interface ComboboxProps {
  isSlash?: boolean
  onSelectItem: (editor: PlateEditor<Value>, item: IComboboxItem) => void
  onRenderItem?: RenderFunction<ComboboxItemProps>
  options?: ComboboxOptions
}

export interface InsertableElement extends TElement {
  type: string
  children: any[]
  value: string
  blockValue?: string
  blockId?: string
  // Also additional properties are added
}
