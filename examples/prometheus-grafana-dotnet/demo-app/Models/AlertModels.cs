using Newtonsoft.Json;

namespace DemoApp.Models;

public class AlertManagerWebhook
{
    [JsonProperty("receiver")]
    public string? Receiver { get; set; }
    
    [JsonProperty("status")]
    public string? Status { get; set; }
    
    [JsonProperty("alerts")]
    public Alert[]? Alerts { get; set; }
    
    [JsonProperty("groupLabels")]
    public Dictionary<string, string>? GroupLabels { get; set; }
    
    [JsonProperty("commonLabels")]
    public Dictionary<string, string>? CommonLabels { get; set; }
}

public class Alert
{
    [JsonProperty("status")]
    public string Status { get; set; } = string.Empty;
    
    [JsonProperty("labels")]
    public Dictionary<string, string> Labels { get; set; } = new();
    
    [JsonProperty("annotations")]
    public Dictionary<string, string> Annotations { get; set; } = new();
    
    [JsonProperty("startsAt")]
    public DateTime StartsAt { get; set; }
    
    [JsonProperty("endsAt")]
    public DateTime? EndsAt { get; set; }
    
    [JsonProperty("fingerprint")]
    public string? Fingerprint { get; set; }
    
    public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;
}

public class AlertStats
{
    public int Total { get; set; }
    public int Resolved { get; set; }
    public int Firing { get; set; }
    public DateTime? LastReceived { get; set; }
}

public class AlertStorage
{
    private readonly List<Alert> _alerts = new();
    private readonly object _lock = new();

    public void AddAlert(Alert alert)
    {
        lock (_lock)
        {
            alert.ReceivedAt = DateTime.UtcNow;
            _alerts.Add(alert);
            
            // Keep only last 1000 alerts
            if (_alerts.Count > 1000)
            {
                _alerts.RemoveRange(0, _alerts.Count - 1000);
            }
        }
    }

    public List<Alert> GetAlerts()
    {
        lock (_lock)
        {
            return _alerts.OrderByDescending(a => a.ReceivedAt).ToList();
        }
    }

    public AlertStats GetStats()
    {
        lock (_lock)
        {
            var firing = _alerts.Count(a => a.Status == "firing");
            var resolved = _alerts.Count(a => a.Status == "resolved");
            
            return new AlertStats
            {
                Total = _alerts.Count,
                Firing = firing,
                Resolved = resolved,
                LastReceived = _alerts.LastOrDefault()?.ReceivedAt
            };
        }
    }

    public void ClearAlerts()
    {
        lock (_lock)
        {
            _alerts.Clear();
        }
    }
}
