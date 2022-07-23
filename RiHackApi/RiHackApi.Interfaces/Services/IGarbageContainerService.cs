using RiHackApi.Common.Wrappers;
using RiHackApi.Domain.Entities;

namespace RiHackApi.Interfaces.Services;

public interface IGarbageContainerService
{
    Task AddGarbageContainer(GarbageContainer garbageContainer);
    Task<GarbageContainer> GetGarbageContainer(Guid id);
    Task<PaginatedResponse<GarbageContainer>> GetGarbageContainers(int page, int pageSize);
    Task<ICollection<GarbageContainer>> GetAllGarbageContainers();
    Task<GarbageContainer> UpdateGarbageContainer(Guid id, GarbageContainer garbageContainer);
    Task DeleteGarbageContainer(Guid id);
    
    Task EnableGarbageContainer(Guid id);
    Task DisableGarbageContainer(Guid id);
}