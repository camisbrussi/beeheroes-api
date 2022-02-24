import { IUserDTO } from '@modules/accounts/dtos/IUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';
import { AuthenticationUseCase } from '../authentication/AuthenticationUseCase';
import { CreateUserUseCase } from '../User/createUser/CreateUserUseCase';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

let authenticationUseCase: AuthenticationUseCase;
let refreshTokenUseCase: RefreshTokenUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DayjsDateProvider;

describe('Refresh Token', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
      authenticationUseCase = new AuthenticationUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepositoryInMemory, 
      dateProvider
    )
  })

    it('should be able to refresh token', async () => {
    const user = {
      name: 'Admin',
      email: 'admin@beeheroes.com',
      password: '123456',
      user_type_id: 'admin'
    };

    await createUserUseCase.execute(user);
    const resultToken = await authenticationUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const { refresh_token } = resultToken;

    const result = await refreshTokenUseCase.execute(refresh_token);

    expect(result).toHaveProperty('token');
 
  });

  it('should not be able to refresh token', async () => {
    const user = {
      name: 'Admin',
      email: 'admin@beeheroes.com',
      password: '123456',
      user_type_id: 'admin'
    };

    await createUserUseCase.execute(user);
    const resultToken = await authenticationUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const { token } = resultToken;
    
    await expect (
      refreshTokenUseCase.execute(token)
    ).rejects.toEqual(new AppError('invalid signature'));
  });
})