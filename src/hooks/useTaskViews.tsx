import { SearchFilter } from './useFilters'

interface View {
  title: string
  filters: SearchFilter<any>[]
}
