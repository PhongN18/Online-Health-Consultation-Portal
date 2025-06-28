using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendOHCP.Migrations
{
    /// <inheritdoc />
    public partial class AddCancelApprovalToAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CancelApproved",
                table: "Appointments",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancelRequestedAt",
                table: "Appointments",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelApproved",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CancelRequestedAt",
                table: "Appointments");
        }
    }
}
