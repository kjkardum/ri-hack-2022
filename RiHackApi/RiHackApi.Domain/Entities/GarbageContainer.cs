using RiHackApi.Common.Entities;

namespace RiHackApi.Domain.Entities;

public class GarbageContainer : AuditableBaseEntity
{
    public string Label { get; set; } = null!;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public bool Active { get; set; }
}