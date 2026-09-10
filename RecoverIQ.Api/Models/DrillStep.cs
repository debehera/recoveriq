namespace RecoverIQ.Api.Models
{
    public class DrillStep
    {
        public int Id { get; set; }

        public int DrillId { get; set; }
        public Drill? Drill { get; set; }

        public int StepOrder { get; set; }
        public string Situation { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;

        public DrillResponse? Response { get; set; }
    }
}