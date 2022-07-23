using RiHackApi.Common.Wrappers;
using RiHackApi.Domain.Entities;

namespace RiHackApi.Interfaces.Services;

public interface IGarbageContainerService
{
    Task AddGarbageContainer(GarbageContainer garbageContainer);
    Task<GarbageContainer> GetGarbageContainer(int id);
    Task<PaginatedResponse<GarbageContainer>> GetGarbageContainers(int page, int pageSize);
    Task<GarbageContainer> UpdateGarbageContainer(int id, GarbageContainer garbageContainer);
    Task DeleteGarbageContainer(int id);
    
    Task EnableGarbageContainer(int id);
    Task DisableGarbageContainer(int id);
}