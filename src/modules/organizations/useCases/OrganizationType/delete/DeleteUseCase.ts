import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { IOrganizationsRepository } from '@modules/organizations/repositories/IOrganizationRepository';
import { IOrganizationTypesRepository } from '@modules/organizations/repositories/IOrganizationTypesRepository';


@injectable()
class DeleteOrganizationTypeUseCase{
  constructor(    
    @inject('OrganizationsRepository')
    private organizationsRepository: IOrganizationsRepository,
    @inject('OrganizationTypesRepository')
    private organizationTypeRepository: IOrganizationTypesRepository,
  ){}

  async execute( id: string): Promise<void> {
    const organizationTypeUsed = await this.organizationsRepository.listOrganizationsByOrganizationType(id);

    if(organizationTypeUsed.length > 0) {
      throw new AppError("Organization type is in use and can't deleted!")
    }
    
    await this.organizationTypeRepository.delete(id);

  }
}

export { DeleteOrganizationTypeUseCase }