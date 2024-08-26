import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceActivityIdWithActivityScheduleId1724403353224
  implements MigrationInterface
{
  name = 'ReplaceActivityIdWithActivityScheduleId1724403353224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. activity_schedule_id 컬럼 추가
    await queryRunner.query(
      `ALTER TABLE \`participation\` ADD COLUMN \`activity_schedule_id\` INT`,
    );

    // 2. activity_schedule_id에 FK 제약 조건 추가
    await queryRunner.query(
      `ALTER TABLE \`participation\` ADD CONSTRAINT \`fk_participation_activity_schedule\`  FOREIGN KEY (\`activity_schedule_id\`)  REFERENCES \`activity_schedule\`(\`id\`)`,
    );

    // 3. activity_id에 FK 제약 조건 제거
    await queryRunner.query(
      `ALTER TABLE \`participation\` DROP FOREIGN KEY \`fk_participation_activity\``,
    );

    // 4. activity_id 컬럼 삭제
    await queryRunner.query(
      `ALTER TABLE \`participation\` DROP COLUMN \`activity_id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. activity_id 컬럼 추가
    await queryRunner.query(
      `ALTER TABLE \`participation\` ADD COLUMN \`activity_id\` INT`,
    );

    // 2. activity_id에 FK 제약 조건 추가
    await queryRunner.query(
      `ALTER TABLE \`participation\` ADD CONSTRAINT \`fk_participation_activity\` FOREIGN KEY (\`activity_id\`) REFERENCES \`activity\`(\`id\`)`,
    );

    // 3. activity_schedule_id에 FK 제약 조건 제거
    await queryRunner.query(
      `ALTER TABLE \`participation\` DROP FOREIGN KEY \`fk_participation_activity_schedule\``,
    );

    // 4. activity_schedule_id 컬럼 제거
    await queryRunner.query(
      `ALTER TABLE \`participation\` DROP COLUMN \`activity_schedule_id\``,
    );
  }
}
