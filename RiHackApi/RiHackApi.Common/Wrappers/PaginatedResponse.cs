namespace RiHackApi.Common.Wrappers;

public class PaginatedResponse<T>
{
    public T Data { get; set; } = default!;
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Count { get; set; }
}