import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1724068871436 implements MigrationInterface {
  name = 'Migration1724068871436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`user_type\` \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`type\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`type\` \`user_type\` varchar(255) NOT NULL`,
    );
  }
}
