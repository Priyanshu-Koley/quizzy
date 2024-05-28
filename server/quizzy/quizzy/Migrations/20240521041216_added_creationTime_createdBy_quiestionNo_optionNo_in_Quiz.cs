using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizzy.Migrations
{
    /// <inheritdoc />
    public partial class added_creationTime_createdBy_quiestionNo_optionNo_in_Quiz : Migration
    {
        /// <inheritdoc /> `    
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Quizzes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "Quizzes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "QuestionNo",
                table: "Questions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OptionNo",
                table: "Options",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_CreatedBy",
                table: "Quizzes",
                column: "CreatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Users_CreatedBy",
                table: "Quizzes",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Users_CreatedBy",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_Quizzes_CreatedBy",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "QuestionNo",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "OptionNo",
                table: "Options");
        }
    }
}
