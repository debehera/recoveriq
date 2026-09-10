using System.ComponentModel.DataAnnotations;

namespace RecoverIQ.Api.Dtos
{
    public class DrillGenerateDto
    {
        [Required]
        public int RunbookId { get; set; }

        [Required]
        public int AssignToUserId { get; set; }
    }

    public class DrillStepDto
    {
        public int Id { get; set; }
        public int StepOrder { get; set; }
        public string Situation { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public DrillResponseDto? Response { get; set; }
    }

    public class DrillResponseDto
    {
        public string ResponseText { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
    }

    public class DrillSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RunbookName { get; set; } = string.Empty;
        public string? AssignedToUsername { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class DrillDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Premise { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RunbookName { get; set; } = string.Empty;
        public List<DrillStepDto> Steps { get; set; } = new();
    }

    public class RespondToStepDto
    {
        [Required]
        [MaxLength(2000)]
        public string ResponseText { get; set; } = string.Empty;
    }
}