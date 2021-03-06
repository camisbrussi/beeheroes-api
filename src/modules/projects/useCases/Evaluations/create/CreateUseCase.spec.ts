import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { OrganizationsRepositoryInMemory } from '@modules/organizations/repositories/in-memory/OrganizationRepositoryInMemory';
import { EvaluationsRepositoryInMemory } from '@modules/projects/repositories/in-memory/EvaluationRepositoryInMemory';
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/in-memory/ProjectRepositoryInMemory';
import { SubscriptionsRepositoryInMemory } from '@modules/projects/repositories/in-memory/SubscriptionRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateEvaluationUseCase } from './CreateUseCase';

let createEvaluationUseCase: CreateEvaluationUseCase;
let evaluationsRepositoryInMemory: EvaluationsRepositoryInMemory;
let subscriptionRepositoryInMemory: SubscriptionsRepositoryInMemory;
let projectsRepositoryInMemory: ProjectsRepositoryInMemory;
let organizationsRepositoryInMemory: OrganizationsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

beforeEach(() => {
  evaluationsRepositoryInMemory = new EvaluationsRepositoryInMemory();
  subscriptionRepositoryInMemory = new SubscriptionsRepositoryInMemory();
  projectsRepositoryInMemory = new ProjectsRepositoryInMemory();
  usersRepositoryInMemory = new UsersRepositoryInMemory();
  organizationsRepositoryInMemory = new OrganizationsRepositoryInMemory();
  createEvaluationUseCase = new CreateEvaluationUseCase(
    evaluationsRepositoryInMemory,
    subscriptionRepositoryInMemory,
  );
});

describe('Create Evaluation ', () => {
  it('should be able to create a new evaluation ', async () => {
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

    const subscription = await subscriptionRepositoryInMemory.create({
      registration_date: new Date(),
      project_id: project.id,
      user_id: user.id,
    });

    const evaluation = await createEvaluationUseCase.execute({
      score: 5,
      description: 'xxxx',
      subscription_id: subscription.id,
    });

    expect(evaluation).toHaveProperty('id');
    expect(evaluation.score).toEqual(5);
  });

  it('should not be able to create a new evaluation case organization does not exists', async () => {
    await expect(
      createEvaluationUseCase.execute({
        score: 5,
        description: 'xxxx',
        subscription_id: 'subscription.id',
      }),
    ).rejects.toEqual(new AppError('Subscription does not exists!'));
  });
});
