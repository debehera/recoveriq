using System.ComponentModel.DataAnnotations;

namespace RecoverIQ.Api.Dtos
{
    public class RunbookStepDto
    {
        public int StepOrder { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class RunbookCreateDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string SystemName { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int RtoMinutes { get; set; }

        [Range(1, int.MaxValue)]
        public int RpoMinutes { get; set; }

        [MinLength(1)]
        public List<string> Steps { get; set; } = new();
    }

    public class RunbookResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SystemName { get; set; } = string.Empty;
        public int RtoMinutes { get; set; }
        public int RpoMinutes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<RunbookStepDto> Steps { get; set; } = new();
    }
}