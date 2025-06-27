using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendOHCP.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorCareOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DoctorCareOption",
                columns: table => new
                {
                    DoctorProfileId = table.Column<int>(type: "int", nullable: false),
                    CareOption = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorCareOption", x => new { x.DoctorProfileId, x.CareOption });
                    table.ForeignKey(
                        name: "FK_DoctorCareOption_DoctorProfiles_DoctorProfileId",
                        column: x => x.DoctorProfileId,
                        principalTable: "DoctorProfiles",
                        principalColumn: "DoctorProfileId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorCareOption");
        }
    }
}
