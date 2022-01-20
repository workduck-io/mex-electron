export type Value = {
  label: string
  value: string
}

export interface SelectState {
  options: { label: string; value: string }[]
  value: Value | null
}
