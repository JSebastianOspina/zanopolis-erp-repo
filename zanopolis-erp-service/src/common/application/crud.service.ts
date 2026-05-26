import {
  ICrudRepository,
  PaginatedResult,
  PaginationParams,
} from '../domain/interfaces/crud.repository.interface';
import { NotFoundException } from '../domain/exceptions/custom-exceptions/not-found-exception';

export abstract class CrudService<Model, IdType> {
  constructor(protected repository: ICrudRepository<Model, IdType>) {}

  async get(id: IdType): Promise<Model> {
    const entity = await this.repository.get(id);
    if (!entity) {
      throw new NotFoundException('Entity not found', { id });
    }
    return entity;
  }

  async create(model: Partial<Model>, _userId?: string): Promise<Model> {
    return this.repository.create(model);
  }

  async update(id: IdType, model: Partial<Model>): Promise<Model> {
    await this.get(id); // Ensure exists
    return this.repository.update(id, model);
  }

  async delete(id: IdType, _userId?: string): Promise<void> {
    await this.get(id); // Ensure exists
    await this.repository.delete(id);
  }

  async search(
    filter: any,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Model>> {
    return this.repository.search(filter, pagination);
  }
}
