using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace RecoverIQ.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);

                context.Response.ContentType = "application/json";

                // Map known exception types to sensible status codes; default to 500.
                var (statusCode, message) = ex switch
                {
                    DbUpdateException dbEx when dbEx.InnerException?.Message.Contains("FOREIGN KEY", StringComparison.OrdinalIgnoreCase) == true
                        => (HttpStatusCode.Conflict, "This item can't be deleted or changed because other records depend on it."),
                    UnauthorizedAccessException
                        => (HttpStatusCode.Forbidden, "You don't have permission to do that."),
                    InvalidOperationException
                        => (HttpStatusCode.BadGateway, ex.Message),
                    _
                        => (HttpStatusCode.InternalServerError, "Something went wrong on our end. Please try again.")
                };

                context.Response.StatusCode = (int)statusCode;

                var payload = JsonSerializer.Serialize(new { message });
                await context.Response.WriteAsync(payload);
            }
        }
    }

    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
