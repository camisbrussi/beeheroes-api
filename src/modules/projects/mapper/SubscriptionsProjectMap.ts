import { instanceToInstance } from 'class-transformer';

import { ISubscriptionDTO } from '../dtos/ISubscriptionDTO';

type SubscriptionsProject = {
  id: string;
  status: number;
  volunteer: {
    id: string;
    name: string;
    avatar: string;
  }
}

class SubscriptionsProjectMap {
  static toDTO({
    id,
    status,
    volunteer,
  }: SubscriptionsProject): ISubscriptionDTO {
    const subscriptions = instanceToInstance({
      id,
      status,
      volunteer,
    });
    return subscriptions;
  }
}

export { SubscriptionsProjectMap };
