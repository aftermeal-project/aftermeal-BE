import { InvitationForm } from '../dto/invitation.form';

export interface InvitationService {
  invite(invitationForm: InvitationForm);
}
