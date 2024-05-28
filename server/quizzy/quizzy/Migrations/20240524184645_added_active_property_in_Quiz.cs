using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizzy.Migrations
{
    /// <inheritdoc />
    public partial class added_active_property_in_Quiz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Quizzes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Active",
                table: "Quizzes");
        }
    }
}
