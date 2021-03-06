import { getRepository, Repository } from 'typeorm';

import { ISubscriptionDTO } from '@modules/projects/dtos/ISubscriptionDTO';
import { ISubscriptionsRepository } from '@modules/projects/repositories/ISubscriptiosRepository';

import { Subscription } from '../entities/Subscription';

class SubscriptionsRepository implements ISubscriptionsRepository {
  private subscriptionsRepository: Repository<Subscription>

  constructor() {
    this.subscriptionsRepository = getRepository(Subscription);
  }

  async create({
    registration_date,
    project_id,
    user_id,
  }: ISubscriptionDTO): Promise<Subscription> {
    const subscription = this.subscriptionsRepository.create({
      registration_date,
      project_id,
      user_id,
    });

    await this.subscriptionsRepository.save(subscription);

    return subscription;
  }

  async findByProjectId(id: string): Promise<Subscription[]> {
    const subscriptions = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .where('subscription.project_id = :project_id', { project_id: id })
      .getMany();

    return subscriptions;
  }

  async findByUserId(user_id: string): Promise<Subscription[]> {
    const subscriptions = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.project', 'project')
      .where('subscription.user_id = :user_id', { user_id })
      .getMany();

    return subscriptions;
  }

  async findById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({ id });

    return subscription;
  }

  async countByProject(id: string): Promise<number> {
    const totalSubscription = await this.subscriptionsRepository.count({ project_id: id });

    return totalSubscription;
  }

  async filter({
    registration_date,
    participation_date,
    project_id,
    user_id,
    status,
  }: ISubscriptionDTO): Promise<Subscription[]> {
    const subscriptionsQuery = await this.subscriptionsRepository
      .createQueryBuilder('u')
      .where('1 = 1');
    if (registration_date) {
      subscriptionsQuery.andWhere('registration_date > :registration_date', { registration_date });
    }

    if (participation_date) {
      subscriptionsQuery.andWhere('participation_date < :participation_date', { participation_date });
    }

    if (status) {
      subscriptionsQuery.andWhere('status = :status', { status });
    }

    if (project_id) {
      subscriptionsQuery.andWhere('project_id = :project_id', { project_id });
    }

    if (user_id) {
      subscriptionsQuery.andWhere('user_id = :user_id', { user_id });
    }

    const subscriptions = await subscriptionsQuery.getMany();

    return subscriptions;
  }

  async update({
    id,
    registration_date,
    participation_date,
    status,
  }: ISubscriptionDTO): Promise<Subscription> {
    const setSubscription: ISubscriptionDTO = { };

    if (registration_date) setSubscription.registration_date = registration_date;
    if (participation_date) setSubscription.participation_date = participation_date;
    if (status) setSubscription.status = status;

    const subscriptionTypeEdited = await this.subscriptionsRepository
      .createQueryBuilder()
      .update()
      .set(setSubscription)
      .where('id = :id')
      .setParameters({ id })
      .execute();

    return subscriptionTypeEdited.raw;
  }
}

export { SubscriptionsRepository };
