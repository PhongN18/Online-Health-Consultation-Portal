using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendOHCP.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoSession_FK_Appointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_VideoSessions_AppointmentId",
                table: "VideoSessions",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoSessions_Appointments_AppointmentId",
                table: "VideoSessions",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VideoSessions_Appointments_AppointmentId",
                table: "VideoSessions");

            migrationBuilder.DropIndex(
                name: "IX_VideoSessions_AppointmentId",
                table: "VideoSessions");
        }
    }
}
