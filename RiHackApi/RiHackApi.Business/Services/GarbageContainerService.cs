using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Wrappers;
using RiHackApi.Domain.Entities;
using RiHackApi.Interfaces.Services;

namespace RiHackApi.Business.Services;

public class GarbageContainerService : IGarbageContainerService
{
    private readonly IGenericRepository<ContainerLocation> _containerLocationRepository;
    private readonly IGenericRepository<GarbageContainer> _garbageContainerRepository;

    public GarbageContainerService(IGenericRepository<ContainerLocation> containerLocationRepository , IGenericRepository<GarbageContainer> garbageContainerRepository)
    {
        _containerLocationRepository = containerLocationRepository;
        _garbageContainerRepository = garbageContainerRepository;
    }

    public async Task AddContainerLocation(ContainerLocation containerLocation)
    {
        containerLocation.Id = Guid.Empty;
        await _containerLocationRepository.AddAsync(containerLocation);
        await _containerLocationRepository.SaveAllChanges();
    }

    public async Task AddGarbageContainer(GarbageContainer garbageContainer)
    {
        garbageContainer.Id = Guid.Empty;
        await _garbageContainerRepository.AddAsync(garbageContainer);
        await _garbageContainerRepository.SaveAllChanges();
    }

    public Task<ContainerLocation> GetContainerLocation(Guid id)
    {
        var containerLocation = _containerLocationRepository.FirstOrDefaultAsync(c => c.Id == id);
        if (containerLocation == null)
        {
            throw new Exception("ContainerLocation not found");
        }
        return containerLocation;
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

    public async Task<PaginatedResponse<ContainerLocation>> GetContainerLocations(int page, int pageSize)
    {
        var query = _containerLocationRepository
            .AsQueryable()
            .Skip((page - 1) * pageSize)
            .Take(pageSize);
        
        return new PaginatedResponse<ContainerLocation>
        {
            Data = await _containerLocationRepository.GetAllAsync(query),
            Page = page,
            PageSize = pageSize,
            Count = await _containerLocationRepository.CountAsync(_containerLocationRepository.AsQueryable())
        };
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

    public Task<ICollection<GarbageContainer>> GetAllContainerLocations()
    {
        return _garbageContainerRepository.GetAllAsync();
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
        existingContainer.Type = garbageContainer.Type;
        
        _garbageContainerRepository.Update(existingContainer);
        await _garbageContainerRepository.SaveAllChanges();
        return existingContainer;
    }
    
    public async Task<ContainerLocation> UpdateContainerLocation(Guid id, ContainerLocation containerLocation)
    {
        var existingContainer = await _containerLocationRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (existingContainer == null)
        {
            throw new Exception("Container not found");
        }
        
        existingContainer.Latitude = containerLocation.Latitude;
        existingContainer.Longitude = containerLocation.Longitude;
        
        _containerLocationRepository.Update(existingContainer);
        await _containerLocationRepository.SaveAllChanges();
        return existingContainer;
    }

    public async Task DeleteContainerLocation(Guid id)
    {
        var existingContainer = await _containerLocationRepository.FirstOrDefaultAsync(t => t.Id == id);
        if (existingContainer == null)
        {
            throw new Exception("Container not found");
        }
        _containerLocationRepository.Delete(existingContainer);
        await _containerLocationRepository.SaveAllChanges();
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
}