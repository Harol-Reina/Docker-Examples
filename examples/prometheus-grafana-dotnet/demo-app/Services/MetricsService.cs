using Prometheus;

namespace DemoApp.Services;

public interface IMetricsService
{
    void IncrementSimulationCounter(string type);
    void SetCpuUsage(double value);
    void SetMemoryUsage(double value);
    void SetActiveConnections(int count);
    void SetBusinessValue(double value);
}

public class MetricsService : IMetricsService
{
    private readonly Counter _httpRequestsTotal;
    private readonly Histogram _httpRequestDuration;
    private readonly Gauge _activeConnections;
    private readonly Gauge _businessValue;
    private readonly Gauge _cpuUsage;
    private readonly Gauge _memoryUsage;
    private readonly Counter _simulationCounter;

    public MetricsService()
    {
        // HTTP metrics
        _httpRequestsTotal = Metrics
            .CreateCounter("demo_app_http_requests_total", "Total HTTP requests", new[] { "method", "endpoint", "status" });

        _httpRequestDuration = Metrics
            .CreateHistogram("demo_app_http_request_duration_seconds", "HTTP request duration in seconds",
                new[] { "method", "endpoint" },
                new HistogramConfiguration
                {
                    Buckets = new[] { 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10 }
                });

        // Business metrics
        _activeConnections = Metrics
            .CreateGauge("demo_app_active_connections", "Number of active connections");

        _businessValue = Metrics
            .CreateGauge("demo_app_business_value", "Custom business metric for demonstration");

        // Performance simulation metrics
        _cpuUsage = Metrics
            .CreateGauge("demo_app_cpu_usage", "Simulated CPU usage percentage");

        _memoryUsage = Metrics
            .CreateGauge("demo_app_memory_usage", "Simulated memory usage percentage");

        _simulationCounter = Metrics
            .CreateCounter("demo_app_simulation_total", "Total simulation requests", new[] { "type" });

        // Start background tasks to simulate metrics
        StartBackgroundMetrics();
    }

    public void IncrementSimulationCounter(string type)
    {
        _simulationCounter.WithLabels(type).Inc();
    }

    public void SetCpuUsage(double value)
    {
        _cpuUsage.Set(value);
    }

    public void SetMemoryUsage(double value)
    {
        _memoryUsage.Set(value);
    }

    public void SetActiveConnections(int count)
    {
        _activeConnections.Set(count);
    }

    public void SetBusinessValue(double value)
    {
        _businessValue.Set(value);
    }

    private void StartBackgroundMetrics()
    {
        // Simulate active connections
        Task.Run(async () =>
        {
            while (true)
            {
                var connections = Random.Shared.Next(10, 100);
                SetActiveConnections(connections);
                await Task.Delay(5000);
            }
        });

        // Simulate business metric
        Task.Run(async () =>
        {
            while (true)
            {
                var value = Random.Shared.NextDouble() * 1000;
                SetBusinessValue(value);
                await Task.Delay(3000);
            }
        });

        // Simulate CPU usage
        Task.Run(async () =>
        {
            while (true)
            {
                var cpu = Random.Shared.Next(10, 50);
                SetCpuUsage(cpu);
                await Task.Delay(8000);
            }
        });

        // Simulate memory usage
        Task.Run(async () =>
        {
            while (true)
            {
                var memory = Random.Shared.Next(30, 70);
                SetMemoryUsage(memory);
                await Task.Delay(6000);
            }
        });
    }
}
