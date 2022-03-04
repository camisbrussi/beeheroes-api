import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUserTypesRepository } from '@modules/accounts/repositories/IUserTypesRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class DeleteUserTypeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTypesRepository')
    private userTypeRepository: IUserTypesRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const userTypeUsed = await this.usersRepository.listUsersByUserType(id);

    if (userTypeUsed.length > 0) {
      throw new AppError("User type is in use and can't deleted!");
    }

    await this.userTypeRepository.delete(id);
  }
}

export { DeleteUserTypeUseCase };