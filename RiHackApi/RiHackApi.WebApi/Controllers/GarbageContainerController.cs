using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiHackApi.Common.Constants;
using RiHackApi.Domain.Entities;
using RiHackApi.Interfaces.Services;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class GarbageContainerController : BaseApiController
{
    private readonly IGarbageContainerService _garbageContainerService;

    public GarbageContainerController(IGarbageContainerService garbageContainerService)
    {
        _garbageContainerService = garbageContainerService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _garbageContainerService.GetAllGarbageContainers());
    }
    
    [HttpGet("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> GetById(Guid id)
    {
        return Ok(await _garbageContainerService.GetGarbageContainer(id));
    }
    
    [HttpGet("paginated")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> GetPaginated([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _garbageContainerService.GetGarbageContainers(page, pageSize));
    }
    
    [HttpPost]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Create(GarbageContainer garbageContainer)
    {
        await _garbageContainerService.AddGarbageContainer(garbageContainer);
        return Ok();
    }
    
    [HttpPut("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Update(Guid id, GarbageContainer garbageContainer)
    {
        await _garbageContainerService.UpdateGarbageContainer(id, garbageContainer);
        return Ok();
    }
    
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _garbageContainerService.DeleteGarbageContainer(id);
        return Ok();
    }
    
    [HttpPatch("{id:guid}/enable")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Activate(Guid id)
    {
        await _garbageContainerService.EnableGarbageContainer(id);
        return Ok();
    }
    
    [HttpPatch("{id:guid}/disable")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        await _garbageContainerService.DisableGarbageContainer(id);
        return Ok();
    }
}