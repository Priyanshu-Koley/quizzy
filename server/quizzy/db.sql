CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Email" text NOT NULL,
    "Password" text NOT NULL,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240504071556_Added_user', '8.0.4');

COMMIT;

START TRANSACTION;

CREATE TABLE "Quizzes" (
    "QuizId" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    CONSTRAINT "PK_Quizzes" PRIMARY KEY ("QuizId")
);

CREATE TABLE "Questions" (
    "QuestionId" uuid NOT NULL,
    "Title" text NOT NULL,
    "QuizId" uuid NOT NULL,
    CONSTRAINT "PK_Questions" PRIMARY KEY ("QuestionId"),
    CONSTRAINT "FK_Questions_Quizzes_QuizId" FOREIGN KEY ("QuizId") REFERENCES "Quizzes" ("QuizId") ON DELETE CASCADE
);

CREATE TABLE "Options" (
    "OptionId" uuid NOT NULL,
    "Text" text NOT NULL,
    "IsCorrect" boolean NOT NULL,
    "QuestionId" uuid NOT NULL,
    CONSTRAINT "PK_Options" PRIMARY KEY ("OptionId"),
    CONSTRAINT "FK_Options_Questions_QuestionId" FOREIGN KEY ("QuestionId") REFERENCES "Questions" ("QuestionId") ON DELETE CASCADE
);

CREATE INDEX "IX_Options_QuestionId" ON "Options" ("QuestionId");

CREATE INDEX "IX_Questions_QuizId" ON "Questions" ("QuizId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240505152942_added_Quiz_Question_Option_tables', '8.0.4');

COMMIT;

START TRANSACTION;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240505161939_made_some_updation', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Users" RENAME COLUMN "Password" TO "PasswordSalt";

ALTER TABLE "Users" ADD "PasswordHash" text NOT NULL DEFAULT '';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240512135949_changed_User_Model', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Users" ADD "RoleID" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

CREATE TABLE "Roles" (
    "Id" uuid NOT NULL,
    "RoleName" text NOT NULL,
    "Description" text,
    CONSTRAINT "PK_Roles" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Users_RoleID" ON "Users" ("RoleID");

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_Roles_RoleID" FOREIGN KEY ("RoleID") REFERENCES "Roles" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240516154616_added_role', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Quizzes" ADD "CreatedBy" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

ALTER TABLE "Quizzes" ADD "CreationTime" timestamp with time zone NOT NULL DEFAULT TIMESTAMPTZ '-infinity';

ALTER TABLE "Questions" ADD "QuestionNo" integer NOT NULL DEFAULT 0;

ALTER TABLE "Options" ADD "OptionNo" integer NOT NULL DEFAULT 0;

CREATE INDEX "IX_Quizzes_CreatedBy" ON "Quizzes" ("CreatedBy");

ALTER TABLE "Quizzes" ADD CONSTRAINT "FK_Quizzes_Users_CreatedBy" FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id") ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240521041216_added_creationTime_createdBy_quiestionNo_optionNo_in_Quiz', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Options" RENAME COLUMN "Text" TO "Title";

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240521182600_changed_text_to_title_in_Option', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Quizzes" ADD "TotalTimeInSeconds" integer NOT NULL DEFAULT 0;

ALTER TABLE "Questions" ADD "Marks" integer NOT NULL DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240523113716_added_totalTime_marks_in_Quiz', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Quizzes" ALTER COLUMN "CreationTime" SET DEFAULT (NOW());

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240523115000_set_default_value_of_creationTime_in_Quiz', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Quizzes" ADD "Active" boolean NOT NULL DEFAULT FALSE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240524184645_added_active_property_in_Quiz', '8.0.4');

COMMIT;

START TRANSACTION;

ALTER TABLE "Quizzes" ALTER COLUMN "Active" SET DEFAULT TRUE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240524185847_set_default_value_to_active_in_Quiz', '8.0.4');

COMMIT;

