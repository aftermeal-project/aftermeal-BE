import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserTypeToType1724068871436 implements MigrationInterface {
  name = 'RenameUserTypeToType1724068871436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user CHANGE user_type type varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user CHANGE type user_type varchar(255) NOT NULL`,
    );
  }
}
