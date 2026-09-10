namespace RecoverIQ.Api.Models
{
    public class DrillResponse
    {
        public int Id { get; set; }

        public int DrillStepId { get; set; }
        public DrillStep? DrillStep { get; set; }

        public int SubmittedByUserId { get; set; }
        public User? SubmittedByUser { get; set; }

        public string ResponseText { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}