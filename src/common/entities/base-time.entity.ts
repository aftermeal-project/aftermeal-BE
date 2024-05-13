import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseTimeEntity {
  @CreateDateColumn({ type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt?: Date;
}
