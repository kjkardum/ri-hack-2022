using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RiHackApi.Common.Settings;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class StatusController : BaseApiController
{
    private readonly ApplicationSettings _appSettings;

    public StatusController(IOptions<ApplicationSettings> appSettings)
    {
        _appSettings = appSettings.Value;
    }
    
    [HttpGet("health-check")]
    public IActionResult HealthCheck()
    {
        return Ok("Ok");
    }
    
    [HttpGet("login-check")]
    [Authorize]
    public IActionResult LoginCheck()
    {
        return Ok("Ok");
    }
    
    [HttpGet("urls-check")]
    public IActionResult UrlsCheck()
    {
        return Ok(new
        {
            FrontendUrl = _appSettings.FrontendUrl,
            ChatbotUrl = _appSettings.ChatbotUrl,
            OptimizerUrl = _appSettings.OptimizerUrl,
            ChatbotApiKey = _appSettings.ChatbotApiKey,
        });
    }
}