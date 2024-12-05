import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../../../user/domain/entities/user.entity';
import { Participation } from '../../domain/entities/participation.entity';
import { Role } from '../../../user/domain/entities/role';

@Injectable()
export class ParticipationOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user: User = request.user;
    const participation: Participation = request.participation;

    const isAdmin: boolean = user.role === Role.ADMIN;

    if (isAdmin || participation.isOwnedBy(user)) {
      return true;
    }

    throw new ForbiddenException('본인의 참가만 삭제할 수 있습니다.');
  }
}
