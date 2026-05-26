import { FilterLogicalOperatorEnum, FilterOperatorEnum, SortEnum } from "./filter.enum"

export type IUbitsFilterArgs = Record<
  string,
  { operator: FilterOperatorEnum; value: any; primary?: boolean }
>

export interface IUbitsFilterOrder {
  key: string
  sort: SortEnum
}

export interface IUbitsFilterPage {
  start: number
  end: number
  length?: number
  pageIndex?: number
  pageSize?: number
  totalPages?: number
}

export interface IUbitsFilter {
  args?: IUbitsFilterArgs
  logicalOperator?: FilterLogicalOperatorEnum
  order?: IUbitsFilterOrder
  page?: IUbitsFilterPage
  pageFrom?: number
  pageTo?: number
}
