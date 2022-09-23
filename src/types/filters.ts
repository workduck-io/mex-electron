export const FilterTypeArray = [
  'note', // Does item belong to note
  'tag', // Does item have tag
  'date', // Does item have date TODO: Use updated and created will need before after and range
  'state', // Does item have a specific
  'has', // Does item have a specific data property
  'mention', // Does item mention a specific user
  'space' // Does item belong to a specific space
] as const

// Produces a union type of the values of FilterTypeArray
export type FilterType = typeof FilterTypeArray[number]

export const FilterJoinArray = [
  'all', // All values should match
  'any', // Any value should match
  'notAny', // Any value should not match (if any one matches, item dropped)
  'none' // None of the values should match (if some match, item passed, if all match item dropped)
] as const

export type FilterJoin = typeof FilterJoinArray[number]

export interface FilterValue {
  /** Unique id of filter value */
  id: string

  label: string

  /** Value of the filter, usually the id for the type of the filter */
  value: string

  /** The number of items that match this value */
  count?: number
}

export interface Filter {
  /** Unique id for the filter */
  id: string

  /** The type of the filter */
  type: FilterType

  /** How to join this filters values */
  join: FilterJoin

  /** Whether there can be multiple values selected */
  multiple: boolean

  /**
   * The values of the filter
   * No values in both multi and single are represented by empty array
   */
  values: FilterValue[] | FilterValue
}

export interface FilterTypeWithOptions {
  type: FilterType
  label: string
  options: FilterValue[]
}

export type Filters = Array<FilterTypeWithOptions>

export type FilterFunction = (item: any, filter: Filter) => boolean | number

export type SearchFilterFunctions = Partial<{
  [key in FilterType]: FilterFunction
}>
