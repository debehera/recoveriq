using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecoverIQ.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDrillEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drills",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RunbookId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Premise = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    AssignedToUserId = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Drills_Runbooks_RunbookId",
                        column: x => x.RunbookId,
                        principalTable: "Runbooks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Drills_Users_AssignedToUserId",
                        column: x => x.AssignedToUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DrillSteps",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DrillId = table.Column<int>(type: "INTEGER", nullable: false),
                    StepOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    Situation = table.Column<string>(type: "TEXT", nullable: false),
                    Question = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrillSteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrillSteps_Drills_DrillId",
                        column: x => x.DrillId,
                        principalTable: "Drills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DrillResponses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DrillStepId = table.Column<int>(type: "INTEGER", nullable: false),
                    SubmittedByUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ResponseText = table.Column<string>(type: "TEXT", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrillResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrillResponses_DrillSteps_DrillStepId",
                        column: x => x.DrillStepId,
                        principalTable: "DrillSteps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DrillResponses_Users_SubmittedByUserId",
                        column: x => x.SubmittedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrillResponses_DrillStepId",
                table: "DrillResponses",
                column: "DrillStepId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DrillResponses_SubmittedByUserId",
                table: "DrillResponses",
                column: "SubmittedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Drills_AssignedToUserId",
                table: "Drills",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Drills_RunbookId",
                table: "Drills",
                column: "RunbookId");

            migrationBuilder.CreateIndex(
                name: "IX_DrillSteps_DrillId",
                table: "DrillSteps",
                column: "DrillId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrillResponses");

            migrationBuilder.DropTable(
                name: "DrillSteps");

            migrationBuilder.DropTable(
                name: "Drills");
        }
    }
}
