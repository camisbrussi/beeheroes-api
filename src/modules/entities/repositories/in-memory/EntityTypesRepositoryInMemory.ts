import { IEntityTypesRepository } from '../IEntityTypesRepository';
import { EntityType } from '@modules/entities/infra/typeorm/entities/EntityTypes'
import { IEntityTypeDTO } from '@modules/entities/dtos/IEntityTypeDTO';

class EntityTypeRepositoryInMemory implements IEntityTypesRepository {
  entityTypes: EntityType[] = [];

  async findByName(name: string): Promise<EntityType> {
    const entityType = this.entityTypes.find((entityType) => entityType.name === name);
    return entityType;
  }

  async list(): Promise<EntityType[]> {
    const all = this.entityTypes;
    return all;
  }

  async create({
    name,
    description
  }: IEntityTypeDTO): Promise<EntityType> {
    const entityTypes = new EntityType();
    
    const entityType = Object.assign(entityTypes, {
      name,
      description
    });

    this.entityTypes.push( entityTypes );

    return entityType;
  }
}

export { EntityTypeRepositoryInMemory }