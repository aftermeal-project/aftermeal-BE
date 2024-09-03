import { Participation } from './participation.entity';

export interface ParticipationRepository {
  findOneById(id: number): Promise<Participation>;
  findByUserIdAndActivityId(
    userId: number,
    activityId: number,
  ): Promise<Participation>;
  save(participation: Participation): Promise<void>;
  saveAll(participations: Participation[]): Promise<void>;
  delete(participation: Participation): Promise<void>;
  deleteAll(): Promise<void>;
}
