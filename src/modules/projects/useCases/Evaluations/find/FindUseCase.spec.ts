import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { VolunteersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/VolunteersRepositoryInMemory';
import { OrganizationsRepositoryInMemory } from '@modules/organizations/repositories/in-memory/OrganizationRepositoryInMemory';
import { EvaluationsRepositoryInMemory } from '@modules/projects/repositories/in-memory/EvaluationRepositoryInMemory';
import { ProjectsRepositoryInMemory } from '@modules/projects/repositories/in-memory/ProjectRepositoryInMemory';
import { SubscriptionsRepositoryInMemory } from '@modules/projects/repositories/in-memory/SubscriptionRepositoryInMemory';

import { FindEvaluationUseCase } from './FindUseCase';

let findEvaluationUseCase: FindEvaluationUseCase;
let evaluationsRepositoryInMemory: EvaluationsRepositoryInMemory;
let subscriptionsRepositoryInMemory: SubscriptionsRepositoryInMemory;
let projectsRepositoryInMemory: ProjectsRepositoryInMemory;
let organizationsRepositoryInMemory: OrganizationsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('Find Evaluation', () => {
  beforeEach(() => {
    subscriptionsRepositoryInMemory = new SubscriptionsRepositoryInMemory();
    projectsRepositoryInMemory = new ProjectsRepositoryInMemory();
    evaluationsRepositoryInMemory = new EvaluationsRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    organizationsRepositoryInMemory = new OrganizationsRepositoryInMemory();
    findEvaluationUseCase = new FindEvaluationUseCase(evaluationsRepositoryInMemory);
  });
  it('should be abe to find project', async () => {
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

    const evaluation = await evaluationsRepositoryInMemory.create({
      score: 5,
      description: 'xxxx',
      subscription_id: subscription.id,
    });

    const evaluationCreated = await findEvaluationUseCase.execute(evaluation.id);

    expect(evaluationCreated.id).toEqual(evaluationCreated.id);
  });
});
