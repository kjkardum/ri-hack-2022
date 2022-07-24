using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiHackApi.Common.Constants;
using RiHackApi.Router.interfaces;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class OptimizerController : BaseApiController
{
    private MyQueryParams _myQueryParams = new MyQueryParams("123");
    
    private IOptimizerService _optimizerService;
    public OptimizerController(IOptimizerService optimizerService)
    {
        _optimizerService = optimizerService;
    }

    [HttpGet("placement/{max:int}")]
    
    public async Task<IActionResult> GetOptimalContainers(int max)
    {
        return Ok(await _optimizerService.GetOptimalContainers(max, _myQueryParams));
    }
    
    [HttpGet("route")]
    
    public async Task<IActionResult> GetOptimalRoute(int drivers, int capacity)
    {
        return Ok(await _optimizerService.GetOptimizedRoute(drivers, capacity, _myQueryParams));
    }
}