import { IComboboxItem } from "./Combobox.types"

export interface RenderFunction<P = { [key: string]: any }> {
  (props: P, defaultRender?: (props?: P) => JSX.Element | null): JSX.Element | null
}

export interface ComboboxItemProps {
  item: IComboboxItem
}