import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTimeSlotToType1724727104323 implements MigrationInterface {
  name = 'RenameTimeSlotToType1724727104323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` CHANGE \`time_slot\` \`type\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`activity_schedule\` DROP COLUMN \`type\``,
    );
  }
}
