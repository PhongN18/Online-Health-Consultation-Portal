using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendOHCP.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentIdToMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
             migrationBuilder.AddColumn<int>(
            name: "AppointmentId",
            table: "Messages",
            type: "int",
            nullable: false,
            defaultValue: 0 // hoặc true, nếu muốn cho phép null
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
            name: "AppointmentId",
            table: "Messages"
            );
        }
    }
}
