import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDayToDayOfWeek1724678028597 implements MigrationInterface {
  name = 'RenameDayToDayOfWeek1724678028597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` CHANGE \`day\` \`day_of_week\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` CHANGE \`day_of_week\` \`day\` varchar(255) NOT NULL`,
    );
  }
}
