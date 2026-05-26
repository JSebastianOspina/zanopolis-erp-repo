/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  ICrudRepository,
  PaginatedResult,
  PaginationParams,
} from '../../domain/interfaces/crud.repository.interface';
import { PrismaService } from './prisma.service';

export abstract class CrudRepositoryPrismaAdapter<
  Model,
  IdType,
> implements ICrudRepository<Model, IdType> {
  constructor(protected prismaService: PrismaService) {}

  protected abstract getTable(): any;
  protected abstract toModel(data: any): Model;
  protected abstract toDto(data: Partial<Model>): any;

  async get(id: IdType): Promise<Model | null> {
    const result = await this.getTable().findUnique({ where: { id } });
    return result ? this.toModel(result) : null;
  }

  async create(model: Partial<Model>): Promise<Model> {
    const data = this.toDto(model);
    const result = await this.getTable().create({ data });
    return this.toModel(result);
  }

  async update(id: IdType, model: Partial<Model>): Promise<Model> {
    const data = this.toDto(model);
    const result = await this.getTable().update({
      where: { id },
      data,
    });
    return this.toModel(result);
  }

  async delete(id: IdType): Promise<void> {
    await this.getTable().delete({ where: { id } });
  }

  async search(
    filter: any,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Model>> {
    const { limit = 50, offset = 0 } = pagination;
    const [data, total] = await Promise.all([
      this.getTable().findMany({
        where: filter,
        take: limit,
        skip: offset,
      }),
      this.getTable().count({ where: filter }),
    ]);

    return {
      data: data.map((item: any) => this.toModel(item)),
      total,
    };
  }
}
