using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizzy.Migrations
{
    /// <inheritdoc />
    public partial class added_totalTime_marks_in_Quiz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalTimeInSeconds",
                table: "Quizzes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Marks",
                table: "Questions",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalTimeInSeconds",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "Marks",
                table: "Questions");
        }
    }
}
