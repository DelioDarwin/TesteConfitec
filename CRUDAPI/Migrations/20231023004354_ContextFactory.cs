using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CRUDAPI.Migrations
{
    public partial class ContextFactory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Escolaridades",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descricao = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Escolaridades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HistoricosEscolares",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(nullable: true),
                    Conteudo = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistoricosEscolares", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(nullable: true),
                    Sobrenome = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    DataNascimento = table.Column<DateTime>(nullable: false),
                    escolaridadeId = table.Column<int>(nullable: false),
                    HistoricoEscolarId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_HistoricosEscolares_HistoricoEscolarId",
                        column: x => x.HistoricoEscolarId,
                        principalTable: "HistoricosEscolares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Usuarios_Escolaridades_escolaridadeId",
                        column: x => x.escolaridadeId,
                        principalTable: "Escolaridades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_HistoricoEscolarId",
                table: "Usuarios",
                column: "HistoricoEscolarId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_escolaridadeId",
                table: "Usuarios",
                column: "escolaridadeId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "HistoricosEscolares");

            migrationBuilder.DropTable(
                name: "Escolaridades");
        }
    }
}
