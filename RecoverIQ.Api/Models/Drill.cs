namespace RecoverIQ.Api.Models
{
    public class Drill
    {
        public int Id { get; set; }

        public int RunbookId { get; set; }
        public Runbook? Runbook { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Premise { get; set; } = string.Empty;
        public string Status { get; set; } = "Generated"; // Generated | InProgress | Completed

        public int? AssignedToUserId { get; set; }
        public User? AssignedToUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<DrillStep> Steps { get; set; } = new();
    }
}