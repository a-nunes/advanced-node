import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsuarios1629845962513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'usuarios',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
        },
        {
          name: 'email',
          type: 'varchar',
          isUnique: true,
          isNullable: false,
        },
        {
          name: 'nome',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'id_facebook',
          type: 'varchar',
          isNullable: true,
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuarios');
  }
}
