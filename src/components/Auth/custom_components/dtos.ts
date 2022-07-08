import { User } from './../../types';

export type UserAndGoogleData = User & {
  pictureUrl: string;
};
