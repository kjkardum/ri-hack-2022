using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using RiHackApi.Common.Interfaces;
using RiHackApi.Persistence.Contexts;

namespace RiHackApi.Persistence.Repositories;


public class ApplicationRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
{
    private readonly ApplicationDbContext _dbContext;

    public ApplicationRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
        var item =await _dbContext.Set<TEntity>().AddAsync(entity);
        return item.Entity;
    }

    public void Update(TEntity entity)
    {
        _dbContext.Set<TEntity>().Update(entity);
    }

    public void Delete(TEntity entity)
    {
        _dbContext.Set<TEntity>().Remove(entity);
    }

    public IQueryable<TEntity> AsQueryable()
    {
        return _dbContext.Set<TEntity>().AsQueryable();
    }

    public IQueryable<TEntity> Include(IQueryable<TEntity> source, Expression<Func<TEntity, object>> navigationPropertyPath)
    {
        return source.Include(navigationPropertyPath);
    }

    public async Task SaveAllChanges()
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> CountAsync(Expression<Func<TEntity, bool>> p)
    {
        return await _dbContext.Set<TEntity>().Where(p).CountAsync();
    }

    public async Task<int> CountAsync(IQueryable<TEntity> source)
    {
        return await source.CountAsync();
    }

    public async Task<ICollection<TEntity>> GetAllAsync()
    {
        return await _dbContext.Set<TEntity>().ToListAsync();
    }

    public async Task<ICollection<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> p)
    {
        return await _dbContext.Set<TEntity>().Where(p).ToListAsync();
    }

    public async Task<ICollection<TEntity>> GetAllAsync(IQueryable<TEntity> query)
    {
        return await query.ToListAsync();
    }

    public async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> p)
    {
        return await _dbContext.Set<TEntity>().FirstOrDefaultAsync(p);
    }

    public async Task<TEntity?> FirstOrDefaultAsync(IQueryable<TEntity> query)
    {
        return await query.FirstOrDefaultAsync();
    }
}
