using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class StatusController : BaseApiController
{
    public StatusController()
    {
        
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
}