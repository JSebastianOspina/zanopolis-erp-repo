export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum FilterOperatorEnum {
  EqualTo = '==',
  NotEqualTo = '!=',
  GreaterThan = '>',
  GreaterThanOrEqualTo = '>=',
  LessThan = '<',
  LessThanOrEqualTo = '<=',
  ILike = 'iLike',
  Includes = 'includes',
  ContainsWord = 'containsWord',
}

export enum FilterLogicalOperatorEnum {
  AND = '&&',
  OR = '||',
}
