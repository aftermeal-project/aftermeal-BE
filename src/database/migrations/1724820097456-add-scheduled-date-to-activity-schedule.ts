import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScheduledDateToActivitySchedule1724820097456
  implements MigrationInterface
{
  name = 'AddScheduledDateToActivitySchedule1724820097456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` DROP COLUMN \`day_of_week\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` ADD \`scheduled_date\` date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` MODIFY COLUMN \`type\` enum('LUNCH', 'DINNER') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` MODIFY COLUMN \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` DROP COLUMN \`scheduled_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` ADD \`day_of_week\` varchar(255) NOT NULL`,
    );
  }
}
