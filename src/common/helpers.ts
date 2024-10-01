import { User } from 'users/users.entity';

export interface ICreateAccount {
  user: User;
  token: string;
}
