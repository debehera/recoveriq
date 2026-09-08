using System.ComponentModel.DataAnnotations;

namespace RecoverIQ.Api.Models
{
    public class Runbook
    {
        public int Id { get; set; }

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

        public int CreatedByUserId { get; set; }
        public User? CreatedByUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<RunbookStep> Steps { get; set; } = new();
    }
}