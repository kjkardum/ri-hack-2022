using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RiHackApi.Persistence.Migrations
{
    public partial class AddContainerMaxWeight : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MaxWeight",
                table: "GarbageContainers",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxWeight",
                table: "GarbageContainers");
        }
    }
}
