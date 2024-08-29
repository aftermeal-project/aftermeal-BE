import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToActivitySchedule1724902882581
  implements MigrationInterface
{
  name = 'AddStatusToActivitySchedule1724902882581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` ADD \`status\` enum ('SCHEDULED', 'IN_PROGRESS', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` DROP COLUMN \`status\``,
    );
  }
}
