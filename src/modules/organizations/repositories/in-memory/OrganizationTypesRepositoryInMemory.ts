import { IOrganizationTypeDTO } from '@modules/organizations/dtos/IOrganizationTypeDTO';
import { OrganizationType } from '@modules/organizations/infra/typeorm/entities/OrganizationType';

import { IOrganizationTypesRepository } from '../IOrganizationTypesRepository';

class OrganizationTypeRepositoryInMemory implements IOrganizationTypesRepository {
  organizationTypes: OrganizationType[] = [];

  async create({
    name,
    id,
  }: IOrganizationTypeDTO): Promise<OrganizationType> {
    const organizationTypes = new OrganizationType();

    const organizationType = Object.assign(organizationTypes, {
      id,
      name,
    });

    this.organizationTypes.push(organizationTypes);

    return organizationType;
  }

  async findByName(name: string): Promise<OrganizationType> {
    const organizationType = this.organizationTypes
      .find((organizationType) => organizationType.name === name);
    return organizationType;
  }

  async findById(id: number): Promise<OrganizationType> {
    const organizationType = this.organizationTypes
      .find((organizationType) => organizationType.id === id);
    return organizationType;
  }

  async list(): Promise<OrganizationType[]> {
    const all = this.organizationTypes;
    return all;
  }

  async update({ id, name }: IOrganizationTypeDTO): Promise<OrganizationType> {
    const findIndex = this.organizationTypes
      .findIndex((organizationType) => organizationType.id === id);

    if (name) this.organizationTypes[findIndex].name = name;

    return this.organizationTypes[findIndex];
  }

  async delete(id: number): Promise<void> {
    const organizationType = this.organizationTypes.find((ut) => ut.id === id);
    this.organizationTypes.splice(this.organizationTypes.indexOf(organizationType));
  }
}

export { OrganizationTypeRepositoryInMemory };
