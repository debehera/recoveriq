using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecoverIQ.Api.Data;
using RecoverIQ.Api.Dtos;
using RecoverIQ.Api.Models;
using RecoverIQ.Api.Services;
using System.Security.Claims;

namespace RecoverIQ.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DrillController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IScenarioGeneratorService _generator;

        public DrillController(AppDbContext db, IScenarioGeneratorService generator)
        {
            _db = db;
            _generator = generator;
        }

        [HttpPost("generate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Generate(DrillGenerateDto dto)
        {
            var runbook = await _db.Runbooks
                .Include(r => r.Steps)
                .FirstOrDefaultAsync(r => r.Id == dto.RunbookId);

            if (runbook == null) return BadRequest(new { message = "Runbook not found." });
            if (runbook.Steps.Count == 0) return BadRequest(new { message = "This runbook has no recovery steps to build a scenario from." });

            var assignee = await _db.Users.FirstOrDefaultAsync(u => u.Id == dto.AssignToUserId && u.Role == "TeamMember");
            if (assignee == null) return BadRequest(new { message = "Assigned user not found or is not a Team Member." });

            GeneratedScenario scenario;
            try
            {
                scenario = await _generator.GenerateAsync(runbook);
            }
            catch (Exception ex)
            {
                return StatusCode(502, new { message = $"Failed to generate scenario. Please try again. ({ex.Message})" });
            }

            var drill = new Drill
            {
                RunbookId = runbook.Id,
                Title = scenario.Title,
                Premise = scenario.Premise,
                Status = "Generated",
                AssignedToUserId = assignee.Id,
                Steps = scenario.Steps.Select(s => new DrillStep
                {
                    StepOrder = s.StepOrder,
                    Situation = s.Situation,
                    Question = s.Question
                }).ToList()
            };

            _db.Drills.Add(drill);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = drill.Id }, await ToSummaryDto(drill.Id));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var username = User.FindFirstValue(ClaimTypes.Name)!;
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var currentUser = await _db.Users.AsNoTracking().FirstAsync(u => u.Username == username);

            var query = _db.Drills.AsNoTracking().Include(d => d.Runbook).Include(d => d.AssignedToUser).AsQueryable();

            if (role != "Admin")
            {
                query = query.Where(d => d.AssignedToUserId == currentUser.Id);
            }

            var drills = await query.OrderByDescending(d => d.CreatedAt).ToListAsync();

            return Ok(drills.Select(d => new DrillSummaryDto
            {
                Id = d.Id,
                Title = d.Title,
                Status = d.Status,
                RunbookName = d.Runbook?.Name ?? "(runbook deleted)",
                AssignedToUsername = d.AssignedToUser?.Username,
                CreatedAt = d.CreatedAt
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var username = User.FindFirstValue(ClaimTypes.Name)!;
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var currentUser = await _db.Users.AsNoTracking().FirstAsync(u => u.Username == username);

            var drill = await _db.Drills
                .AsNoTracking()
                .Include(d => d.Runbook)
                .Include(d => d.Steps).ThenInclude(s => s.Response)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (drill == null) return NotFound(new { message = "Drill not found." });

            if (role != "Admin" && drill.AssignedToUserId != currentUser.Id)
            {
                return Forbid();
            }

            return Ok(ToDetailDto(drill));
        }

        [HttpPost("{id}/steps/{stepId}/respond")]
        [Authorize(Roles = "TeamMember")]
        public async Task<IActionResult> Respond(int id, int stepId, RespondToStepDto dto)
        {
            var trimmed = dto.ResponseText?.Trim();
            if (string.IsNullOrWhiteSpace(trimmed))
            {
                return BadRequest(new { message = "Please enter a response before submitting." });
            }
            if (trimmed.Length > 2000)
            {
                return BadRequest(new { message = "Response is too long (max 2000 characters)." });
            }

            var username = User.FindFirstValue(ClaimTypes.Name)!;
            var currentUser = await _db.Users.FirstAsync(u => u.Username == username);

            var drill = await _db.Drills
                .Include(d => d.Steps).ThenInclude(s => s.Response)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (drill == null) return NotFound(new { message = "Drill not found." });
            if (drill.AssignedToUserId != currentUser.Id) return Forbid();

            var step = drill.Steps.FirstOrDefault(s => s.Id == stepId);
            if (step == null) return NotFound(new { message = "Step not found." });

            if (step.Response != null)
            {
                step.Response.ResponseText = trimmed;
                step.Response.SubmittedAt = DateTime.UtcNow;
            }
            else
            {
                _db.DrillResponses.Add(new DrillResponse
                {
                    DrillStepId = step.Id,
                    SubmittedByUserId = currentUser.Id,
                    ResponseText = trimmed
                });
            }

            if (drill.Status == "Generated") drill.Status = "InProgress";

            await _db.SaveChangesAsync();

            var allSteps = await _db.DrillSteps.AsNoTracking().Include(s => s.Response).Where(s => s.DrillId == drill.Id).ToListAsync();
            if (allSteps.All(s => s.Response != null))
            {
                drill.Status = "Completed";
                await _db.SaveChangesAsync();
            }

            var refreshed = await _db.Drills
                .AsNoTracking()
                .Include(d => d.Runbook)
                .Include(d => d.Steps).ThenInclude(s => s.Response)
                .FirstAsync(d => d.Id == id);

            return Ok(ToDetailDto(refreshed));
        }

        private async Task<DrillSummaryDto> ToSummaryDto(int drillId)
        {
            var d = await _db.Drills.AsNoTracking().Include(x => x.Runbook).Include(x => x.AssignedToUser).FirstAsync(x => x.Id == drillId);
            return new DrillSummaryDto
            {
                Id = d.Id,
                Title = d.Title,
                Status = d.Status,
                RunbookName = d.Runbook?.Name ?? "(runbook deleted)",
                AssignedToUsername = d.AssignedToUser?.Username,
                CreatedAt = d.CreatedAt
            };
        }

        private static DrillDetailDto ToDetailDto(Drill d) => new()
        {
            Id = d.Id,
            Title = d.Title,
            Premise = d.Premise,
            Status = d.Status,
            RunbookName = d.Runbook?.Name ?? "(runbook deleted)",
            Steps = d.Steps.OrderBy(s => s.StepOrder).Select(s => new DrillStepDto
            {
                Id = s.Id,
                StepOrder = s.StepOrder,
                Situation = s.Situation,
                Question = s.Question,
                Response = s.Response == null ? null : new DrillResponseDto
                {
                    ResponseText = s.Response.ResponseText,
                    SubmittedAt = s.Response.SubmittedAt
                }
            }).ToList()
        };
    }
}
