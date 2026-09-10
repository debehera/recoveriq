using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecoverIQ.Api.Data;
using RecoverIQ.Api.Dtos;

namespace RecoverIQ.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("team-members")]
        public async Task<IActionResult> GetTeamMembers()
        {
            var members = await _db.Users
                .Where(u => u.Role == "TeamMember")
                .Select(u => new UserSummaryDto { Id = u.Id, Username = u.Username })
                .ToListAsync();

            return Ok(members);
        }
    }
}