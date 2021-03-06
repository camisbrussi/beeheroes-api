import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAddresses1647447702152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table(
        {
          name: 'addresses',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
            },
            {
              name: 'street',
              type: 'varchar',
              isNullable: true,

            },
            {
              name: 'number',
              type: 'varchar',
              isNullable: true,

            },
            {
              name: 'complement',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'district',
              type: 'varchar',
              isNullable: true,

            },
            {
              name: 'cep',
              type: 'int',
              isNullable: true,

            },
            {
              name: 'city_id',
              type: 'int',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
          foreignKeys: [
            {
              name: 'FKCityAddress',
              referencedTableName: 'cities',
              referencedColumnNames: ['id'],
              columnNames: ['city_id'],
              onDelete: 'SET NULL',
              onUpdate: 'SET NULL',
            },
          ],
        },
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
