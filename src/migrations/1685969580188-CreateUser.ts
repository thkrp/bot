import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1685969580188 implements MigrationInterface {
    name = 'CreateUser1685969580188';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."app_user_role_enum" AS ENUM('USER')`);
        await queryRunner.query(
            `CREATE TABLE "app_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "telegram_id" bigint NOT NULL, "role" "public"."app_user_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_ffbd960ea40cd4aad33d904afb5" UNIQUE ("telegram_id"), CONSTRAINT "PK_22a5c4a3d9b2fb8e4e73fc4ada1" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "app_user"`);
        await queryRunner.query(`DROP TYPE "public"."app_user_role_enum"`);
    }
}
