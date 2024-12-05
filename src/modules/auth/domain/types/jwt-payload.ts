import { Role } from '../../../user/domain/entities/role';

export type AccessTokenPayload = {
  sub: string | number;
  username: string;
  role: Role;
};
