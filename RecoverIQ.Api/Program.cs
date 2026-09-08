using Microsoft.EntityFrameworkCore;
using RecoverIQ.Api.Data;
using RecoverIQ.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register our database connection (SQLite via EF Core)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Allow our React frontend (running on localhost:5173, Vite's default) to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Seed 2 demo users on startup, only if none exist yet
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Users.Any())
    {
        db.Users.AddRange(
            new User { Username = "admin1", PasswordHash = "temp-plaintext-admin123", Role = "Admin" },
            new User { Username = "member1", PasswordHash = "temp-plaintext-member123", Role = "TeamMember" }
        );
        db.SaveChanges();
    }
}

app.Run();