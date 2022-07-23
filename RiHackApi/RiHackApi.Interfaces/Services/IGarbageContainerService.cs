using RiHackApi.Common.Wrappers;
using RiHackApi.Domain.Entities;

namespace RiHackApi.Interfaces.Services;

public interface IGarbageContainerService
{
    Task AddContainerLocation(ContainerLocation containerLocation);
    Task AddGarbageContainer(GarbageContainer garbageContainer);
    
    Task<ContainerLocation> GetContainerLocation(Guid id);
    Task<GarbageContainer> GetGarbageContainer(Guid id);
    
    Task<PaginatedResponse<ContainerLocation>> GetContainerLocations(int page, int pageSize);
    Task<PaginatedResponse<GarbageContainer>> GetGarbageContainers(int page, int pageSize);
    
    Task<ICollection<GarbageContainer>> GetAllContainerLocations();
    Task<ICollection<GarbageContainer>> GetAllGarbageContainers();
    
    Task<ContainerLocation> UpdateContainerLocation(Guid id, ContainerLocation containerLocation);
    Task<GarbageContainer> UpdateGarbageContainer(Guid id, GarbageContainer garbageContainer);
    
    Task DeleteContainerLocation(Guid id);
    Task DeleteGarbageContainer(Guid id);
}