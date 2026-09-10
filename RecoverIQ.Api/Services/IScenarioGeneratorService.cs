using RecoverIQ.Api.Models;

namespace RecoverIQ.Api.Services
{
    public class GeneratedStep
    {
        public int StepOrder { get; set; }
        public string Situation { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
    }

    public class GeneratedScenario
    {
        public string Title { get; set; } = string.Empty;
        public string Premise { get; set; } = string.Empty;
        public List<GeneratedStep> Steps { get; set; } = new();
    }

    public interface IScenarioGeneratorService
    {
        Task<GeneratedScenario> GenerateAsync(Runbook runbook);
    }
}