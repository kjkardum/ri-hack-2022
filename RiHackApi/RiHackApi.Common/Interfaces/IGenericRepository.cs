using System.Linq.Expressions;

namespace RiHackApi.Common.Interfaces;

public interface IGenericRepository<TEntity> where TEntity : class
{
    Task<TEntity> AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Delete(TEntity entity);
    IQueryable<TEntity> AsQueryable();
    IQueryable<TEntity> Include(IQueryable<TEntity> source, Expression<Func<TEntity, Object>> navigationPropertyPath);
    Task SaveAllChanges();

    Task<int> CountAsync(Expression<Func<TEntity, bool>> p);
    Task<int> CountAsync(IQueryable<TEntity> source);
    
    Task<ICollection<TEntity>> GetAllAsync();
    Task<ICollection<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> p);
    Task<ICollection<TEntity>> GetAllAsync(IQueryable<TEntity> query);

    Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> p);
    Task<TEntity?> FirstOrDefaultAsync(IQueryable<TEntity> query);
}