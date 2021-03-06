import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePhones1647448035468 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table(
        {
          name: 'phones',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
            },
            {
              name: 'number',
              type: 'varchar',
            },
            {
              name: 'is_whatsapp',
              type: 'boolean',
            },
            {
              name: 'organization_id',
              type: 'uuid',
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
              name: 'FKOrganizationPhones',
              referencedTableName: 'organizations',
              referencedColumnNames: ['id'],
              columnNames: ['organization_id'],
              onDelete: 'SET NULL',
              onUpdate: 'SET NULL',
            },
          ],
        },
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('phones');
  }
}
