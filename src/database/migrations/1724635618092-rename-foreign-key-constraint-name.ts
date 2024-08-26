import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameForeignKeyConstraintName1724635618092
  implements MigrationInterface
{
  name = 'RenameForeignKeyConstraintName1724635618092';

  private readonly constraints = [
    {
      table: 'user_role',
      oldName: 'FK_32a6fc2fcb019d8e3a8ace0f55f',
      newName: 'fk_user_role_role',
      columns: 'role_id',
      referencedTable: 'role',
      referencedColumns: 'id',
      onDelete: 'CASCADE',
    },
    {
      table: 'user_role',
      oldName: 'FK_d0e5815877f7395a198a4cb0a46',
      newName: 'fk_user_role_user',
      columns: 'user_id',
      referencedTable: 'user',
      referencedColumns: 'id',
      onDelete: 'CASCADE',
    },
    {
      table: 'user',
      oldName: 'FK_8922a788e2fe46d9fb0a8c7915c',
      newName: 'fk_user_generation',
      columns: 'generation_number',
      referencedTable: 'generation',
      referencedColumns: 'generation_number',
    },
    {
      table: 'participation',
      oldName: 'FK_85ea245ff2001cf6ce914137fcf',
      newName: 'fk_participation_user',
      columns: 'user_id',
      referencedTable: 'user',
      referencedColumns: 'id',
    },
    {
      table: 'participation',
      oldName: 'FK_e7415312cc21836946329d37e4c',
      newName: 'fk_participation_activity',
      columns: 'activity_id',
      referencedTable: 'activity',
      referencedColumns: 'id',
    },
    {
      table: 'activity_schedule',
      oldName: 'FK_9f17a0d95ce947232798291bb14',
      newName: 'fk_activity_schedule_activity',
      columns: 'activity_id',
      referencedTable: 'activity',
      referencedColumns: 'id',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const constraint of this.constraints) {
      await queryRunner.query(
        `ALTER TABLE \`${constraint.table}\` DROP FOREIGN KEY \`${constraint.oldName}\``,
      );
    }

    for (const constraint of this.constraints) {
      await queryRunner.query(
        `ALTER TABLE \`${constraint.table}\` ADD CONSTRAINT \`${constraint.newName}\` FOREIGN KEY (\`${constraint.columns}\`) REFERENCES \`${constraint.referencedTable}\`(\`${constraint.referencedColumns}\`) ON DELETE ${constraint.onDelete || 'NO ACTION'} ON UPDATE NO ACTION`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const constraint of this.constraints.reverse()) {
      await queryRunner.query(
        `ALTER TABLE \`${constraint.table}\` DROP FOREIGN KEY \`${constraint.newName}\``,
      );
    }

    for (const constraint of this.constraints.reverse()) {
      await queryRunner.query(
        `ALTER TABLE \`${constraint.table}\` ADD CONSTRAINT \`${constraint.oldName}\` FOREIGN KEY (\`${constraint.columns}\`) REFERENCES \`${constraint.referencedTable}\`(\`${constraint.referencedColumns}\`) ON DELETE ${constraint.onDelete || 'NO ACTION'} ON UPDATE NO ACTION`,
      );
    }
  }
}
