using Refit;

namespace RiHackApi.Router.interfaces;

public interface IOptimizerService
{
    [Get("/containters_anywhere/{max}?APITOKEN=")]
    public Task<List<List<double>>> GetOptimalContainers(int max, MyQueryParams queryParams);
    
    [Get("/vrp/{num_drivers}/{capacity}")]
    public Task<List<List<GeoJsonLatLon>>> GetOptimizedRoute(int num_drivers, int capacity, MyQueryParams queryParams );
}

public class MyQueryParams
{
    [AliasAs("API_KEY")]
    public string API_KEY { get; set; }

    public MyQueryParams(string api_key)
    {
        API_KEY = api_key;
    }
}


public class GeoJsonLatLon
{
    public List<List<double>> geojson { get; set; }
    public double lat  { get; set; }
    public double lon { get; set; }
}