using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RiHackApi.Common.Constants;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Settings;
using RiHackApi.Domain.Entities;
using RiHackApi.Router.interfaces;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class OptimizerController : BaseApiController
{   
    private readonly MyQueryParams _apiKey;
    private readonly IOptimizerService _optimizerService;
    private readonly IGenericRepository<ContainerLocation> _containerLocationRepository;

    public OptimizerController(IOptimizerService optimizerService, IOptions<ApplicationSettings> applicationSettings, IGenericRepository<ContainerLocation> containerLocationRepository)
    {
        _optimizerService = optimizerService;
        _containerLocationRepository = containerLocationRepository;
        _apiKey = new MyQueryParams(applicationSettings.Value.OptimizerApiKey ?? string.Empty);
    }

    [HttpGet("placement/{max:int}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> GetOptimalContainers(int max)
    {
        return Ok(await _optimizerService.GetOptimalContainers(max, _apiKey));
    }
    
    [HttpGet("route/{drivers:int}/{capacity:int}")]
    
    public async Task<IActionResult> GetOptimalRoute(int drivers, int capacity)
    {
        // fetch all container locations
        var containerLocations = await _containerLocationRepository.GetAllAsync();
        
        var rob = new RouteOptimizerBody
        {
            Stops = containerLocations.Select(x => new List<double>()
            {
                x.Latitude,
                x.Longitude
            }).ToList(),
            demands = containerLocations.Select(x => 1).ToList(),
            depot = new List<double>()
            {
                containerLocations.First().Latitude,
                containerLocations.First().Longitude
            },
        };
        
        return Ok(await _optimizerService.GetOptimizedRoute(drivers, capacity, _apiKey, rob ));
    }
}
