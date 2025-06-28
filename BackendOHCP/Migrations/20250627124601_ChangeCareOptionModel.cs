using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendOHCP.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCareOptionModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorCareOption_DoctorProfiles_DoctorProfileId",
                table: "DoctorCareOption");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorCareOption",
                table: "DoctorCareOption");

            migrationBuilder.RenameTable(
                name: "DoctorCareOption",
                newName: "DoctorCareOptions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorCareOptions",
                table: "DoctorCareOptions",
                columns: new[] { "DoctorProfileId", "CareOption" });

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorCareOptions_DoctorProfiles_DoctorProfileId",
                table: "DoctorCareOptions",
                column: "DoctorProfileId",
                principalTable: "DoctorProfiles",
                principalColumn: "DoctorProfileId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorCareOptions_DoctorProfiles_DoctorProfileId",
                table: "DoctorCareOptions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorCareOptions",
                table: "DoctorCareOptions");

            migrationBuilder.RenameTable(
                name: "DoctorCareOptions",
                newName: "DoctorCareOption");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorCareOption",
                table: "DoctorCareOption",
                columns: new[] { "DoctorProfileId", "CareOption" });

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorCareOption_DoctorProfiles_DoctorProfileId",
                table: "DoctorCareOption",
                column: "DoctorProfileId",
                principalTable: "DoctorProfiles",
                principalColumn: "DoctorProfileId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
