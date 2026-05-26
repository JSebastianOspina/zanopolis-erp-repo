import { BaseModel } from '../domain/models/base.model';

export class JsonApiSerializer {
  static serialize(model: BaseModel | null) {
    if (!model) return { data: null };

    return {
      data: this.formatModel(model),
    };
  }

  static serializeMany(
    models: BaseModel[] | { data: BaseModel[]; total?: number },
  ) {
    if (Array.isArray(models)) {
      return {
        data: models.map((m) => this.formatModel(m)),
      };
    }

    return {
      data: models.data.map((m) => this.formatModel(m)),
      meta: {
        total: models.total,
      },
    };
  }

  private static formatModel(model: BaseModel) {
    const idField = model.getId();
    const type = model.getType();
    const blacklisted = model.getBlacklistedProperties();
    const relationships = model.getRelationships();

    const attributes: Record<string, unknown> = {};
    const relationshipsData: Record<string, unknown> = {};
    const modelRecord = model as unknown as Record<string, unknown>;

    for (const key of Object.keys(model)) {
      if (
        key === idField ||
        blacklisted.includes(key) ||
        typeof modelRecord[key] === 'function'
      ) {
        continue;
      }

      if (relationships.includes(key)) {
        relationshipsData[key] = modelRecord[key];
      } else {
        attributes[key] = modelRecord[key];
      }
    }

    const result: Record<string, unknown> = {
      type,
      id: modelRecord[idField],
      attributes,
    };

    if (Object.keys(relationshipsData).length > 0) {
      result.relationships = relationshipsData;
    }

    return result;
  }
}
