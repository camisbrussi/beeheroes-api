import { inject, injectable } from 'tsyringe';

import { OrganizationType } from '@modules/organizations/infra/typeorm/entities/OrganizationType';
import { IOrganizationTypesRepository } from '@modules/organizations/repositories/IOrganizationTypesRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest{
  id?: number,
  name: string,
}

@injectable()
class CreateOrganizationTypeUseCase {
  constructor(
    @inject('OrganizationTypesRepository')
    private organizationTypeRepository: IOrganizationTypesRepository,
  ) {}

  async execute({ id, name }: IRequest): Promise<OrganizationType> {
    const organizationTypeExist = await this.organizationTypeRepository.findByName(name);

    if (organizationTypeExist) {
      throw new AppError('Organization type already exists!');
    }

    const organizationType = await this.organizationTypeRepository.create({
      id,
      name,
    });

    return organizationType;
  }
}

export { CreateOrganizationTypeUseCase };
