import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransition1686658238107 implements MigrationInterface {
    name = 'CreateTransition1686658238107';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "transition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tg_group_id" bigint NOT NULL, "state" character varying(50) NOT NULL, "next" text array NOT NULL, CONSTRAINT "tg_group_id_state_key" UNIQUE ("tg_group_id", "state"), CONSTRAINT "PK_bb9daff96e2e8586928b5757e4e" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transition"`);
    }
}
