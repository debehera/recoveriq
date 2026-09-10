using RecoverIQ.Api.Models;
using System.Text;
using System.Text.Json;

namespace RecoverIQ.Api.Services
{
    public class ScenarioGeneratorService : IScenarioGeneratorService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public ScenarioGeneratorService(IConfiguration config, HttpClient httpClient)
        {
            _config = config;
            _httpClient = httpClient;
        }

        public async Task<GeneratedScenario> GenerateAsync(Runbook runbook)
        {
            var apiKey = _config["Gemini:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new InvalidOperationException("Gemini API key is not configured.");
            }

            var stepsList = string.Join("\n", runbook.Steps
                .OrderBy(s => s.StepOrder)
                .Select(s => $"- {s.Description}"));

            var prompt = $@"You are a disaster recovery expert designing a tabletop exercise scenario.

System: {runbook.SystemName}
Recovery Time Objective (RTO): {runbook.RtoMinutes} minutes
Recovery Point Objective (RPO): {runbook.RpoMinutes} minutes
Documented Recovery Steps:
{stepsList}

Generate a realistic disaster scenario that tests this recovery plan. Respond with ONLY raw JSON (no markdown code fences, no extra text) in exactly this shape:

{{
  ""title"": ""short scenario title"",
  ""premise"": ""2-3 sentence description of what disaster has occurred"",
  ""steps"": [
    {{ ""stepOrder"": 1, ""situation"": ""description of what's happening at this point"", ""question"": ""a decision question for the responder"" }}
  ]
}}

Generate between 4 and 6 steps. Each step should escalate or evolve the situation. Return ONLY the JSON object, nothing else.";

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            
           
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={apiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new InvalidOperationException($"Gemini API call failed: {response.StatusCode} - {errorBody}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseJson);
            var rawText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? string.Empty;

            var cleaned = rawText.Trim();
            if (cleaned.StartsWith("```"))
            {
                var firstNewline = cleaned.IndexOf('\n');
                cleaned = cleaned.Substring(firstNewline + 1);
                var lastFence = cleaned.LastIndexOf("```");
                if (lastFence >= 0) cleaned = cleaned.Substring(0, lastFence);
                cleaned = cleaned.Trim();
            }

            try
            {
                var scenario = JsonSerializer.Deserialize<GeneratedScenario>(cleaned, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (scenario == null || scenario.Steps.Count == 0)
                {
                    throw new InvalidOperationException("AI returned an empty or invalid scenario.");
                }

                return scenario;
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Failed to parse AI response as JSON: {ex.Message}");
            }
        }
    }
}