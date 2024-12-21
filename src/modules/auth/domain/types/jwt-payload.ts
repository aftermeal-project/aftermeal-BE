import { Role } from '../../../user/domain/entities/role';

export type AccessTokenPayload = {
  sub: string;
  username: string;
  role: Role;
};
