import { InviteMember } from '../dto/invite.member';
import { Invitation, Target } from '../domain/invitation';

export interface InvitationService {
  invite(dto: InviteMember): Promise<void>;
  getByTarget(target: Target): Promise<Invitation | null>;
  getByInvitationCode(invitationCode: string): Promise<Invitation>;
}
