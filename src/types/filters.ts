export type FilterType =
  | 'note' // Does item belong to note
  | 'tag' // Does item have tag
  | 'date' // Does item have date TODO: Use updated and created will need before after and range
  | 'state' // Does item have a specific
  | 'has' // Does item have a specific data property
  | 'mention' // Does item mention a specific user
  | 'space' // Does item belong to a specific space

export type FilterJoin =
  | 'all' // All values should match
  | 'any' // Any value should match
  | 'notAny' // Any value should not match (if any one matches, item dropped)
  | 'none' // None of the values should match (if some match, item passed, if all match item dropped)

export interface FilterValue {
  id: string
  label: string
  value: string
}

export interface Filter {
  // What is the type of the filter
  type: FilterType

  // How to join this filters values
  join: FilterJoin

  // Either single or multiple values
  values: FilterValue[] | FilterValue
}
