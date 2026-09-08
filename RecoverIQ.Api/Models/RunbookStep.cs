using System.ComponentModel.DataAnnotations;

namespace RecoverIQ.Api.Models
{
    public class RunbookStep
    {
        public int Id { get; set; }

        public int RunbookId { get; set; }
        public Runbook? Runbook { get; set; }

        [Range(1, int.MaxValue)]
        public int StepOrder { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}