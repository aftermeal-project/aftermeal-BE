import { Invitation, Target } from '../domain/invitation';
import { InviteRequestDTO } from '../presentation/dto/invite.req.dto';

export interface InvitationService {
  invite(dto: InviteRequestDTO): Promise<void>;
  getByTarget(target: Target): Promise<Invitation | null>;
  getByInvitationCode(invitationCode: string): Promise<Invitation>;
}
