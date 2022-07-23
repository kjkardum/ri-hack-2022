using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiHackApi.Common.Constants;
using RiHackApi.Domain.Entities;
using RiHackApi.Interfaces.Services;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class ContainerLocationController : BaseApiController
{
    private readonly IGarbageContainerService _garbageContainerService;

    public ContainerLocationController(IGarbageContainerService garbageContainerService)
    {
        _garbageContainerService = garbageContainerService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _garbageContainerService.GetAllContainerLocations());
    }
    
    [HttpGet("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> GetById(Guid id)
    {
        return Ok(await _garbageContainerService.GetContainerLocation(id));
    }
    
    [HttpGet("paginated")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> GetPaginated([FromQuery] int page, [FromQuery] int pageSize)
    {
        return Ok(await _garbageContainerService.GetContainerLocations(page, pageSize));
    }
    
    [HttpPost]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Create(ContainerLocation containerLocation)
    {
        await _garbageContainerService.AddContainerLocation(containerLocation);
        return Ok();
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Update(Guid id, ContainerLocation containerLocation)
    {
        await _garbageContainerService.UpdateContainerLocation(id, containerLocation);
        return Ok();
    }
    
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdmin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _garbageContainerService.DeleteContainerLocation(id);
        return Ok();
    }
}