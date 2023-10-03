import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTgReactionTgUserReaction1686166499767 implements MigrationInterface {
    name = 'CreateTgReactionTgUserReaction1686166499767';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tg_user_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tg_user_id" bigint NOT NULL, "tg_group_id" bigint NOT NULL, "tg_reaction_owner_id" bigint NOT NULL, "tg_message_id" integer NOT NULL, "tg_reaction_id" uuid, CONSTRAINT "tg_user_id_tg_group_id_tg_reaction_owner_id_key" UNIQUE ("tg_user_id", "tg_group_id", "tg_reaction_owner_id", "tg_message_id"), CONSTRAINT "PK_e2ff0b04a87e73c12aa12923cf6" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."tg_reaction_type_enum" AS ENUM('LIKE', 'DISLIKE', 'FIRE', 'POOP')`
        );
        await queryRunner.query(
            `CREATE TABLE "tg_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."tg_reaction_type_enum" NOT NULL, "value" integer NOT NULL, CONSTRAINT "UQ_4288341608363779748c3e23034" UNIQUE ("type"), CONSTRAINT "PK_5580668a984a7dce771e0d70097" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "tg_user_reaction" ADD CONSTRAINT "FK_094af600cac6d6677d6b388f2fd" FOREIGN KEY ("tg_reaction_id") REFERENCES "tg_reaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(`INSERT INTO "tg_reaction" ("type", "value") VALUES ('LIKE', 1)`);
        await queryRunner.query(`INSERT INTO "tg_reaction" ("type", "value") VALUES ('DISLIKE', -1)`);
        await queryRunner.query(`INSERT INTO "tg_reaction" ("type", "value") VALUES ('FIRE', 5)`);
        await queryRunner.query(`INSERT INTO "tg_reaction" ("type", "value") VALUES ('POOP', -5)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tg_user_reaction" DROP CONSTRAINT "FK_094af600cac6d6677d6b388f2fd"`);
        await queryRunner.query(`DROP TABLE "tg_reaction"`);
        await queryRunner.query(`DROP TYPE "public"."tg_reaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "tg_user_reaction"`);
    }
}
