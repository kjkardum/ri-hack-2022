using System.Text.Json.Serialization;

namespace RiHackApi.Common.Entities;

public abstract class AuditableBaseEntity : BaseEntity
{
    [JsonIgnore]
    public Guid? CreatedBy { get; set; }
    
    [JsonIgnore]
    public DateTime Created { get; set; }
    
    [JsonIgnore]
    public Guid? LastModifiedBy { get; set; }
    
    [JsonIgnore]
    public DateTime? LastModified { get; set; }
}