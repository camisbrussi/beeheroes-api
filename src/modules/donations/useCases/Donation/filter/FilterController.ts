import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { userPermissions } from '@utils/userPermissions';
import { validateUserPermissions } from '@utils/validateUserPermissions';

import { FilterDonationUseCase } from './FilterUseCase';

class FilterDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    // const user = await userPermissions(request);

    // const hasAllPermissions = validateUserPermissions({
    //   user,
    //   permissions: ['donation.list'],
    //   roles: ['administrator', 'responsible'],
    // });

    // if (!hasAllPermissions) {
    //   throw new AppError('User without permission!', 401);
    // }

    const filter = {
      name: request.body.name,
      start: request.body.status,
      organization_id: request.body.organization_id,
    };

    const filterDonationUseCase = container.resolve(FilterDonationUseCase);

    const donation = await filterDonationUseCase.execute(filter);

    return response.status(200).json(donation);
  }
}

export { FilterDonationController };
