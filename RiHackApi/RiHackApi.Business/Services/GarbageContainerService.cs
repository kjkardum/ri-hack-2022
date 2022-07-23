using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Wrappers;
using RiHackApi.Domain.Entities;
using RiHackApi.Interfaces.Services;

namespace RiHackApi.Business.Services;

public class GarbageContainerService : IGarbageContainerService
{
    private readonly IGenericRepository<GarbageContainer> _garbageContainerRepository;

    public GarbageContainerService(IGenericRepository<GarbageContainer> garbageContainerRepository)
    {
        _garbageContainerRepository = garbageContainerRepository;
    }

    public async Task AddGarbageContainer(GarbageContainer garbageContainer)
    {
        garbageContainer.Id = Guid.Empty;
        await _garbageContainerRepository.AddAsync(garbageContainer);
        await _garbageContainerRepository.SaveAllChanges();
    }

    public async Task<GarbageContainer> GetGarbageContainer(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<PaginatedResponse<GarbageContainer>> GetGarbageContainers(int page, int pageSize)
    {
        throw new NotImplementedException();
    }

    public async Task<GarbageContainer> UpdateGarbageContainer(int id, GarbageContainer garbageContainer)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteGarbageContainer(int id)
    {
        throw new NotImplementedException();
    }

    public async Task EnableGarbageContainer(int id)
    {
        throw new NotImplementedException();
    }

    public async Task DisableGarbageContainer(int id)
    {
        throw new NotImplementedException();
    }
}