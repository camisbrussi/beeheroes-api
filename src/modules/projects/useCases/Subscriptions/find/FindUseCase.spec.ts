import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { OrganizationsRepositoryInMemory } from '@modules/organizations/repositories/in-memory/OrganizationRepositoryInMemory';
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/in-memory/ProjectRepositoryInMemory';
import { SubscriptionsRepositoryInMemory } from '@modules/projects/repositories/in-memory/SubscriptionRepositoryInMemory';
import { VolunteersRepositoryInMemory } from '@modules/volunteers/repositories/in-memory/VolunteersRepositoryInMemory';

import { FindSubscriptionUseCase } from './FindUseCase';

let findSubscriptionUseCase: FindSubscriptionUseCase;
let subscriptionsRepositoryInMemory: SubscriptionsRepositoryInMemory;
let projectsRepositoryInMemory: ProjectsRepositoryInMemory;
let volunteersRepositoryInMemory: VolunteersRepositoryInMemory;
let organizationsRepositoryInMemory: OrganizationsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('List Project', () => {
  beforeEach(() => {
    subscriptionsRepositoryInMemory = new SubscriptionsRepositoryInMemory();
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory();
    volunteersRepositoryInMemory = new VolunteersRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    organizationsRepositoryInMemory = new OrganizationsRepositoryInMemory();
    findSubscriptionUseCase = new FindSubscriptionUseCase(subscriptionsRepositoryInMemory);
  });

  it('should be abe to find a subscription', async () => {
    const organization = await organizationsRepositoryInMemory.create({
      name: 'Organization Name',
      email: 'organization@beeheroes.com',
      cnpj: '000000000000',
      description: 'Description Organization',
      organization_type_id: 'id',
    });

    const project = await projectsRepositoryInMemory.create({
      name: 'Test Project',
      description: 'Test Project',
      start: new Date(),
      end: new Date(),
      vacancies: 2,
      organization_id: organization.id,
    });

    const user = await await usersRepositoryInMemory.create({
      name: 'Name test',
      email: 'teste@beeheroes.com',
      password: '123456',
      user_type_id: 1,
    });

    const volunteer = await volunteersRepositoryInMemory.create({
      cpf: '0000',
      profession: 'profession',
      description: 'xxxx',
      occupation_area_id: 'occupationArea',
      user_id: user.id,
    });

    const subscriptionCreate = await subscriptionsRepositoryInMemory.create({
      registration_date: new Date(),
      project_id: project.id,
      volunteer_id: volunteer.id,
    });

    const subscription = await findSubscriptionUseCase.execute(subscriptionCreate.id);

    expect(subscription.id).toEqual(subscription.id);
  });
});
