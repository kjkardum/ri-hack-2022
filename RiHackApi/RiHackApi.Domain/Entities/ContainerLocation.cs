using RiHackApi.Common.Entities;
using TypeGen.Core.TypeAnnotations;

namespace RiHackApi.Domain.Entities;

[ExportTsClass]
public class ContainerLocation : AuditableBaseEntity
{
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public ICollection<GarbageContainer>? GarbageContainers { get; set; }
}