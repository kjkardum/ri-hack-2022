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

    public async Task<GarbageContainer> GetGarbageContainer(Guid id)
    {
        var container = await _garbageContainerRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (container == null)
        {
            throw new Exception("Container not found");
        }
        return container;
    }

    public async Task<PaginatedResponse<GarbageContainer>> GetGarbageContainers(int page, int pageSize)
    {
        var query = _garbageContainerRepository
            .AsQueryable()
            .Skip((page - 1) * pageSize)
            .Take(pageSize);
        return new PaginatedResponse<GarbageContainer>
        {
            Data = await _garbageContainerRepository.GetAllAsync(query),
            Page = page,
            PageSize = pageSize,
            Count = await _garbageContainerRepository.CountAsync(_garbageContainerRepository.AsQueryable())
        };
    }

    public async Task<ICollection<GarbageContainer>> GetAllGarbageContainers()
    {
        return await _garbageContainerRepository.GetAllAsync();
    }

    public async Task<GarbageContainer> UpdateGarbageContainer(Guid id, GarbageContainer garbageContainer)
    {
        var existingContainer = await _garbageContainerRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (existingContainer == null)
        {
            throw new Exception("Container not found");
        }
        existingContainer.Label = garbageContainer.Label;
        existingContainer.Latitude = garbageContainer.Latitude;
        existingContainer.Longitude = garbageContainer.Longitude;
        existingContainer.Active = garbageContainer.Active;
        _garbageContainerRepository.Update(existingContainer);
        await _garbageContainerRepository.SaveAllChanges();
        return existingContainer;
    }

    public async Task DeleteGarbageContainer(Guid id)
    {
        var existingContainer = await _garbageContainerRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (existingContainer == null)
        {
            throw new Exception("Container not found");
        }
        _garbageContainerRepository.Delete(existingContainer);
        await _garbageContainerRepository.SaveAllChanges();
    }

    public async Task EnableGarbageContainer(Guid id)
    {
        var existingContainer = await _garbageContainerRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (existingContainer == null)
        {
            throw new Exception("Container not found");
        }
        existingContainer.Active = true;
        _garbageContainerRepository.Update(existingContainer);
        await _garbageContainerRepository.SaveAllChanges();
    }

    public async Task DisableGarbageContainer(Guid id)
    {
        var existingContainer = await _garbageContainerRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (existingContainer == null)
        {
            throw new Exception("Container not found");
        }
        existingContainer.Active = false;
        _garbageContainerRepository.Update(existingContainer);
        await _garbageContainerRepository.SaveAllChanges();
    }
}