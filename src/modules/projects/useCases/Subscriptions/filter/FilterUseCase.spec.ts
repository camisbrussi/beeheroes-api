import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { VolunteersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/VolunteersRepositoryInMemory';
import { OrganizationsRepositoryInMemory } from '@modules/organizations/repositories/in-memory/OrganizationRepositoryInMemory';
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/in-memory/ProjectRepositoryInMemory';
import { SubscriptionsRepositoryInMemory } from '@modules/projects/repositories/in-memory/SubscriptionRepositoryInMemory';

import { FilterSubscriptionUseCase } from './FilterUseCase';

let filterSubscriptionUseCase: FilterSubscriptionUseCase;
let subscriptionsRepositoryInMemory: SubscriptionsRepositoryInMemory;
let projectsRepositoryInMemory: ProjectsRepositoryInMemory;
let volunteersRepositoryInMemory: VolunteersRepositoryInMemory;
let organizationsRepositoryInMemory: OrganizationsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('List Project', () => {
  beforeEach(() => {
    subscriptionsRepositoryInMemory = new SubscriptionsRepositoryInMemory();
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    organizationsRepositoryInMemory = new OrganizationsRepositoryInMemory();
    filterSubscriptionUseCase = new FilterSubscriptionUseCase(subscriptionsRepositoryInMemory);
  });

  it('should be abe to filter subscription', async () => {
    const organization = await organizationsRepositoryInMemory.create({
      name: 'Organization Name',
      email: 'organization@beeheroes.com',
      cnpj: '000000000000',
      description: 'Description Organization',
      organization_type_id: 1,
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
    });

    await subscriptionsRepositoryInMemory.create({
      registration_date: new Date(),
      project_id: project.id,
      user_id: user.id,
    });

    const subscriptions = await filterSubscriptionUseCase.execute({
      project_id: project.id,
    });

    expect(subscriptions.length).toBe(1);
  });
});
