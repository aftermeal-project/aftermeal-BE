import { Invitation, Target } from '../domain/invitation';
import { InviteRequestDto } from '../presentation/dto/invite-request.dto';

export interface InvitationService {
  invite(dto: InviteRequestDto): Promise<void>;
  getInvitationByTarget(target: Target): Promise<Invitation | null>;
  getInvitationByInvitationCode(invitationCode: string): Promise<Invitation>;
}
