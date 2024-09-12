import { Participation } from './participation.entity';

export interface ParticipationRepository {
  find(): Promise<Participation[]>;
  findOneById(id: number): Promise<Participation | null>;
  findOneByUserIdAndActivityId(
    userId: number,
    activityId: number,
  ): Promise<Participation | null>;
  save(participation: Participation): Promise<void>;
  saveAll(participations: Participation[]): Promise<void>;
  delete(participation: Participation): Promise<void>;
  deleteAll(): Promise<void>;
}
