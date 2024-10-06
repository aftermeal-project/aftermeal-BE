import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type RoleNameType = 'ADMIN' | 'USER';

export const Roles = (...roles: RoleNameType[]) =>
  SetMetadata(ROLES_KEY, roles);
