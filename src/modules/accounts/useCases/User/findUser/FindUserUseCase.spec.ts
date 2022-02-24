import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { FindUserUseCase } from './FindUserUseCase';


let findUserUseCase: FindUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('List Users', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    findUserUseCase = new FindUserUseCase(usersRepositoryInMemory);
  });

    it('should be abe to find user', async () => {
    const newUser = {
      name: 'User',
      email: 'teste@beeheroes',
      password: 'test',
      user_type_id: 'test'
    }
    
    const { id } = await usersRepositoryInMemory.create(newUser);

    const user = await findUserUseCase.execute(id);

    expect(user.id).toEqual(id)
  });
})