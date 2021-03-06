import { IUserDTO } from '../dtos/IUserDTO';
import { User } from '../infra/typeorm/entities/User';

interface IUsersRepository{
  create(data: IUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  findByIds(ids: string[]): Promise<User[]>
  filter({
    name,
    status,
    is_volunteer,
    state_id,
    city_id,
  }): Promise<User[]>;
  update({
    id,
    name,
    email,
    status,
    password,
  }: IUserDTO): Promise<User>;
}

export { IUsersRepository };
