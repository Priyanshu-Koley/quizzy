using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace quizzy.Migrations
{
    /// <inheritdoc />
    public partial class changed_text_to_title_in_Option : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Options",
                newName: "Title");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Options",
                newName: "Text");
        }
    }
}
