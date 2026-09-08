using Microsoft.EntityFrameworkCore;
using RecoverIQ.Api.Models;

namespace RecoverIQ.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Runbook> Runbooks { get; set; } = null!;
        public DbSet<RunbookStep> RunbookSteps { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Username must be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // One Runbook has many RunbookSteps, cascade delete
            modelBuilder.Entity<Runbook>()
                .HasMany(r => r.Steps)
                .WithOne(s => s.Runbook)
                .HasForeignKey(s => s.RunbookId)
                .OnDelete(DeleteBehavior.Cascade);

            // One User (Admin) creates many Runbooks
            modelBuilder.Entity<Runbook>()
                .HasOne(r => r.CreatedByUser)
                .WithMany()
                .HasForeignKey(r => r.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}