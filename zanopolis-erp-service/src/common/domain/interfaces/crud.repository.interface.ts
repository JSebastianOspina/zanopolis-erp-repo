export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ICrudRepository<Model, IdType> {
  get(id: IdType): Promise<Model | null>;
  create(model: Partial<Model>): Promise<Model>;
  update(id: IdType, model: Partial<Model>): Promise<Model>;
  delete(id: IdType): Promise<void>;
  search(
    filter: any,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Model>>;
}
