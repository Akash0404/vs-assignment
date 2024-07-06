import { User } from './interface';

export const admin: User = {
  id: 1,
  name: 'Shweta',
  email: 'shweta@163.com',
  avatar: './assets/images/avatars/avatar-7.jpg',
};

export const guest: User = {
  name: 'unknown',
  email: 'unknown',
  avatar: './assets/images/avatar-default.jpg',
};
