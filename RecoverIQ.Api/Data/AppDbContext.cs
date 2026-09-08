using Microsoft.EntityFrameworkCore;

namespace RecoverIQ.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets (User, Runbook, etc.) will be added here on Day 4
        // when we build out the data models per SCHEMA.md
    }
}