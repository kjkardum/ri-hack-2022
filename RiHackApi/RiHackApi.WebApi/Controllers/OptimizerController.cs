using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RiHackApi.Common.Constants;
using RiHackApi.Common.Settings;
using RiHackApi.Router.interfaces;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class OptimizerController : BaseApiController
{   
    private readonly MyQueryParams _apiKey;
    private readonly IOptimizerService _optimizerService;

    public OptimizerController(IOptimizerService optimizerService, IOptions<ApplicationSettings> applicationSettings)
    {
        _optimizerService = optimizerService;
        _apiKey = new MyQueryParams(applicationSettings.Value.OptimizerApiKey ?? string.Empty);
    }

    [HttpGet("placement/{max:int}")]
    
    public async Task<IActionResult> GetOptimalContainers(int max)
    {
        return Ok(await _optimizerService.GetOptimalContainers(max, _apiKey));
    }
    
    [HttpGet("route")]
    
    public async Task<IActionResult> GetOptimalRoute(int drivers, int capacity)
    {
        return Ok(await _optimizerService.GetOptimizedRoute(drivers, capacity, _apiKey));
    }
}