using Prometheus;
using DemoApp.Services;
using DemoApp.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// Add Prometheus metrics
builder.Services.AddSingleton<IMetricsService, MetricsService>();
builder.Services.AddSingleton<AlertStorage>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseRouting();

// Enable Prometheus metrics middleware
app.UseHttpMetrics();

app.MapRazorPages();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

// Prometheus metrics endpoint
app.MapMetrics();

// API Endpoints
app.MapGet("/api", () => new
{
    message = "📊 Demo App .NET para Métricas de Prometheus",
    version = "1.0.0",
    technology = "ASP.NET Core 8.0 + Blazor Server",
    endpoints = new[]
    {
        "GET / - Aplicación Blazor principal",
        "GET /metrics - Métricas de Prometheus",
        "GET /health - Health check",
        "GET /alerts - Dashboard web de alertas (Blazor)",
        "GET /api/alerts - API de alertas recibidas",
        "POST /api/webhook/alerts - Webhook para AlertManager",
        "GET /api/simulate/load - Simular carga",
        "GET /api/simulate/error - Simular error",
        "GET /api/simulate/cpu/{seconds} - Simular carga de CPU",
        "GET /api/simulate/memory - Simular uso de memoria"
    }
});

app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Alerts API
var alertStorage = app.Services.GetRequiredService<AlertStorage>();

app.MapGet("/api/alerts", (AlertStorage storage) => 
{
    var stats = storage.GetStats();
    return Results.Ok(stats);
});

app.MapPost("/api/webhook/alerts", async (HttpContext context, AlertStorage storage) =>
{
    try
    {
        using var reader = new StreamReader(context.Request.Body);
        var body = await reader.ReadToEndAsync();
        
        Console.WriteLine($"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] Webhook recibido: {body}");
        
        var webhook = Newtonsoft.Json.JsonConvert.DeserializeObject<AlertManagerWebhook>(body);
        
        if (webhook?.Alerts != null)
        {
            foreach (var alert in webhook.Alerts)
            {
                storage.AddAlert(alert);
            }
        }
        
        return Results.Ok(new { status = "ok", received = webhook?.Alerts?.Length ?? 0 });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error procesando webhook: {ex.Message}");
        return Results.BadRequest(new { error = ex.Message });
    }
});

// Simulation endpoints
var metricsService = app.Services.GetRequiredService<IMetricsService>();

app.MapGet("/api/simulate/load", () =>
{
    // Simulate some work
    Thread.Sleep(Random.Shared.Next(50, 200));
    metricsService.IncrementSimulationCounter("load");
    return Results.Ok(new { message = "Carga simulada", timestamp = DateTime.UtcNow });
});

app.MapGet("/api/simulate/error", () =>
{
    metricsService.IncrementSimulationCounter("error");
    if (Random.Shared.NextDouble() < 0.3)
    {
        return Results.StatusCode(500);
    }
    return Results.Ok(new { message = "Error simulado", timestamp = DateTime.UtcNow });
});

app.MapGet("/api/simulate/cpu/{seconds:int}", (int seconds) =>
{
    Task.Run(() =>
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        while (stopwatch.ElapsedMilliseconds < seconds * 1000)
        {
            // Simulate CPU intensive work
            Math.Sqrt(Random.Shared.NextDouble());
        }
    });
    
    metricsService.SetCpuUsage(Random.Shared.Next(50, 90));
    metricsService.IncrementSimulationCounter("cpu");
    
    return Results.Ok(new { message = $"Simulando CPU por {seconds} segundos", timestamp = DateTime.UtcNow });
});

app.MapGet("/api/simulate/memory", () =>
{
    // Simulate memory usage
    var data = new byte[1024 * 1024 * 10]; // 10MB
    GC.Collect();
    
    metricsService.SetMemoryUsage(Random.Shared.Next(70, 95));
    metricsService.IncrementSimulationCounter("memory");
    
    return Results.Ok(new { message = "Uso de memoria simulado", timestamp = DateTime.UtcNow });
});

app.Run();
