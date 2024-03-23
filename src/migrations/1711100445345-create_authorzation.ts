import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuthorzation1711100445345 implements MigrationInterface {
    name = 'CreateAuthorzation1711100445345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_11df1ca3c731b1b7aeb7d616264"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_157197c72d8d61230b392c00a7e"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_6a7b29549d713dd44d3aaab8981"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_2bb69833a62d12b8ee0c231cbbc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11df1ca3c731b1b7aeb7d61626"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_157197c72d8d61230b392c00a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a7b29549d713dd44d3aaab898"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2bb69833a62d12b8ee0c231cbb"`);
        await queryRunner.query(`CREATE TABLE "author" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "client_id" character varying NOT NULL, "secret_id" character varying NOT NULL, "URI_callback" character varying NOT NULL, "scope" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullname" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "isEditable" SET DEFAULT 'true'`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_31cf5c31d0096f706e3ba3b1e8" ON "roles_permissions" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf98d8fd47610db71dfc5a4a5f" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_deeb1fe94ce2d111a6695a2880" ON "users_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fb14631257670efa14b15a3d8" ON "users_roles" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "author" ADD CONSTRAINT "FK_6138469b55839a7973ba97f9a8e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_31cf5c31d0096f706e3ba3b1e82" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_bf98d8fd47610db71dfc5a4a5ff" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_deeb1fe94ce2d111a6695a2880e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_4fb14631257670efa14b15a3d86" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_4fb14631257670efa14b15a3d86"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_deeb1fe94ce2d111a6695a2880e"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_bf98d8fd47610db71dfc5a4a5ff"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_31cf5c31d0096f706e3ba3b1e82"`);
        await queryRunner.query(`ALTER TABLE "author" DROP CONSTRAINT "FK_6138469b55839a7973ba97f9a8e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4fb14631257670efa14b15a3d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_deeb1fe94ce2d111a6695a2880"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf98d8fd47610db71dfc5a4a5f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31cf5c31d0096f706e3ba3b1e8"`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "isEditable" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_48ce552495d14eae9b187bb6716"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`CREATE INDEX "IDX_2bb69833a62d12b8ee0c231cbb" ON "users_roles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a7b29549d713dd44d3aaab898" ON "users_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_157197c72d8d61230b392c00a7" ON "roles_permissions" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_11df1ca3c731b1b7aeb7d61626" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_2bb69833a62d12b8ee0c231cbbc" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_6a7b29549d713dd44d3aaab8981" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_157197c72d8d61230b392c00a7e" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_11df1ca3c731b1b7aeb7d616264" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
