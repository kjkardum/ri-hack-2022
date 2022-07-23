using System.Text.Json.Serialization;
using RiHackApi.Common.Entities;
using RiHackApi.Domain.Enums;
using TypeGen.Core.TypeAnnotations;

namespace RiHackApi.Domain.Entities;

[ExportTsClass]
public class GarbageContainer : AuditableBaseEntity
{
    public string Label { get; set; } = null!;
    
    public Guid ContainerLocationId { get; set; }
    
    public GarbageContainerType Type { get; set; }

    [JsonIgnore]
    public ContainerLocation? ContainerLocation { get; set; }
}
