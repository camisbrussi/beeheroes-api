import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class UserType1644863243484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "user_types",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true,
                        },
                        {
                            name: "name",
                            type: "varchar",
                        },
                        {
                            name: "description",
                            type: "varchar",
                            isNullable: true
                        },
                        {
                           name: "created_at",
                           type: "timestamp",
                           default: "now()"
                        },
                        {
                           name: "update_at",
                           type: "timestamp",
                           default: "now()"
                        }
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropTable("user_types")
    }

}
