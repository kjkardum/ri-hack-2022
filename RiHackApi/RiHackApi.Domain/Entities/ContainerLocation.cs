using RiHackApi.Common.Entities;
using TypeGen.Core.TypeAnnotations;

namespace RiHackApi.Domain.Entities;

[ExportTsClass]
public class ContainerLocation : AuditableBaseEntity
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public ICollection<GarbageContainer>? GarbageContainers { get; set; }
}