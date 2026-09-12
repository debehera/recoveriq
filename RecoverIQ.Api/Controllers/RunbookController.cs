using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecoverIQ.Api.Data;
using RecoverIQ.Api.Dtos;
using RecoverIQ.Api.Models;
using System.Security.Claims;

namespace RecoverIQ.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RunbookController : ControllerBase
    {
        private readonly AppDbContext _db;

        public RunbookController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var runbooks = await _db.Runbooks
                .AsNoTracking()
                .Include(r => r.Steps)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(runbooks.Select(ToDto));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var runbook = await _db.Runbooks
                .AsNoTracking()
                .Include(r => r.Steps)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (runbook == null) return NotFound(new { message = "Runbook not found." });

            return Ok(ToDto(runbook));
        }

        [HttpPost]
        public async Task<IActionResult> Create(RunbookCreateDto dto)
        {
            var cleanSteps = (dto.Steps ?? new List<string>())
                .Select(s => s?.Trim())
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            if (cleanSteps.Count == 0)
            {
                return BadRequest(new { message = "At least one non-empty recovery step is required." });
            }

            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.SystemName))
            {
                return BadRequest(new { message = "Name and system name are required." });
            }

            var username = User.FindFirstValue(ClaimTypes.Name)!;
            var user = await _db.Users.FirstAsync(u => u.Username == username);

            var runbook = new Runbook
            {
                Name = dto.Name.Trim(),
                SystemName = dto.SystemName.Trim(),
                RtoMinutes = dto.RtoMinutes,
                RpoMinutes = dto.RpoMinutes,
                CreatedByUserId = user.Id,
                Steps = cleanSteps.Select((s, i) => new RunbookStep
                {
                    StepOrder = i + 1,
                    Description = s!
                }).ToList()
            };

            _db.Runbooks.Add(runbook);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = runbook.Id }, ToDto(runbook));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RunbookCreateDto dto)
        {
            var cleanSteps = (dto.Steps ?? new List<string>())
                .Select(s => s?.Trim())
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            if (cleanSteps.Count == 0)
            {
                return BadRequest(new { message = "At least one non-empty recovery step is required." });
            }

            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.SystemName))
            {
                return BadRequest(new { message = "Name and system name are required." });
            }

            var runbook = await _db.Runbooks
                .Include(r => r.Steps)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (runbook == null) return NotFound(new { message = "Runbook not found." });

            runbook.Name = dto.Name.Trim();
            runbook.SystemName = dto.SystemName.Trim();
            runbook.RtoMinutes = dto.RtoMinutes;
            runbook.RpoMinutes = dto.RpoMinutes;

            _db.RunbookSteps.RemoveRange(runbook.Steps);
            runbook.Steps = cleanSteps.Select((s, i) => new RunbookStep
            {
                StepOrder = i + 1,
                Description = s!
            }).ToList();

            await _db.SaveChangesAsync();

            return Ok(ToDto(runbook));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var runbook = await _db.Runbooks.FindAsync(id);
            if (runbook == null) return NotFound(new { message = "Runbook not found." });

            var hasDrills = await _db.Drills.AnyAsync(d => d.RunbookId == id);
            if (hasDrills)
            {
                return Conflict(new { message = "This runbook can't be deleted because it has generated drills. Delete isn't available for runbooks with drill history, to preserve the audit record." });
            }

            _db.Runbooks.Remove(runbook);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        private static RunbookResponseDto ToDto(Runbook r) => new()
        {
            Id = r.Id,
            Name = r.Name,
            SystemName = r.SystemName,
            RtoMinutes = r.RtoMinutes,
            RpoMinutes = r.RpoMinutes,
            CreatedAt = r.CreatedAt,
            Steps = r.Steps.OrderBy(s => s.StepOrder)
                .Select(s => new RunbookStepDto { StepOrder = s.StepOrder, Description = s.Description })
                .ToList()
        };
    }
}
