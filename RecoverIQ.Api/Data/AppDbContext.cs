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
        public DbSet<Drill> Drills { get; set; } = null!;
        public DbSet<DrillStep> DrillSteps { get; set; } = null!;
        public DbSet<DrillResponse> DrillResponses { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Runbook>()
                .HasMany(r => r.Steps)
                .WithOne(s => s.Runbook)
                .HasForeignKey(s => s.RunbookId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Runbook>()
                .HasOne(r => r.CreatedByUser)
                .WithMany()
                .HasForeignKey(r => r.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Drill>()
                .HasOne(d => d.Runbook)
                .WithMany()
                .HasForeignKey(d => d.RunbookId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Drill>()
                .HasOne(d => d.AssignedToUser)
                .WithMany()
                .HasForeignKey(d => d.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Drill>()
                .HasMany(d => d.Steps)
                .WithOne(s => s.Drill)
                .HasForeignKey(s => s.DrillId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DrillStep>()
                .HasOne(s => s.Response)
                .WithOne(r => r.DrillStep!)
                .HasForeignKey<DrillResponse>(r => r.DrillStepId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DrillResponse>()
                .HasIndex(r => r.DrillStepId)
                .IsUnique();

            modelBuilder.Entity<DrillResponse>()
                .HasOne(r => r.SubmittedByUser)
                .WithMany()
                .HasForeignKey(r => r.SubmittedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}