import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { VolunteersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/VolunteersRepositoryInMemory';
import { OrganizationsRepositoryInMemory } from '@modules/organizations/repositories/in-memory/OrganizationRepositoryInMemory';
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/in-memory/ProjectRepositoryInMemory';
import { SubscriptionsRepositoryInMemory } from '@modules/projects/repositories/in-memory/SubscriptionRepositoryInMemory';

import { UpdateSubscriptionUseCase } from './UpdateUseCase';

let updateSubscriptionUseCase: UpdateSubscriptionUseCase;
let subscriptionsRepositoryInMemory: SubscriptionsRepositoryInMemory;
let projectsRepositoryInMemory: ProjectsRepositoryInMemory;
let volunteersRepositoryInMemory: VolunteersRepositoryInMemory;
let organizationsRepositoryInMemory: OrganizationsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

beforeEach(() => {
  subscriptionsRepositoryInMemory = new SubscriptionsRepositoryInMemory();
  projectsRepositoryInMemory = new ProjectsRepositoryInMemory();
  volunteersRepositoryInMemory = new VolunteersRepositoryInMemory();
  usersRepositoryInMemory = new UsersRepositoryInMemory();
  organizationsRepositoryInMemory = new OrganizationsRepositoryInMemory();
  updateSubscriptionUseCase = new UpdateSubscriptionUseCase(
    subscriptionsRepositoryInMemory,
  );
});

describe('Update Subscription ', () => {
  it('should be able to edit a project', async () => {
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

    const subscription = await subscriptionsRepositoryInMemory.create({
      registration_date: new Date(),
      project_id: project.id,
      user_id: user.id,
    });

    const subscriptionEdited = await updateSubscriptionUseCase.execute({
      id: subscription.id,
      status: Number(process.env.SUBSCRIPTION_FINISHED),
    });
    expect(subscriptionEdited.status).toEqual(Number(process.env.SUBSCRIPTION_STATUS_FINISHED));
  });
});
