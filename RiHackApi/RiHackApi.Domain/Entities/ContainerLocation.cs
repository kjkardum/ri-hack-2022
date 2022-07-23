using RiHackApi.Common.Entities;

namespace RiHackApi.Domain.Entities;

public class ContainerLocation : AuditableBaseEntity
{
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public ICollection<GarbageContainer>? GarbageContainers { get; set; }
}