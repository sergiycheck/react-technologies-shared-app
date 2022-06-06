export type User = {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  photos?: PublicFile[];
  email: string;
};

export type PublicFile = {
  id: string;
  url: string;
  key: string;
  bucket: string;
  eTag: string;
  num: number;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  expiredUrl: string;
};

export type GenericDataNorm<TData> = {
  [key: string]: TData;
};
