using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RiHackApi.Common.Entities;
using RiHackApi.Common.Interfaces;
using RiHackApi.Domain.Entities;
using RiHackApi.Persistence.Entities;

namespace RiHackApi.Persistence.Contexts;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    private readonly IAuthUserService _authUserService;
    
    public DbSet<GarbageContainer> GarbageContainers { get; set; }
    public DbSet<ContainerLocation> ContainerLocations { get; set; }

    public ApplicationDbContext(DbContextOptions options, IAuthUserService authUserService) : base(options)
    {
        _authUserService = authUserService;
    }
    
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        foreach (var entry in ChangeTracker.Entries<AuditableBaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Created = DateTime.UtcNow;
                    entry.Entity.CreatedBy = _authUserService.UserId;
                    break;
                case EntityState.Modified:
                    entry.Entity.LastModified = DateTime.UtcNow;
                    entry.Entity.LastModifiedBy = _authUserService.UserId;
                    break;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}