from async_fetcher import Async_Fetcher, OSRM_URL
import asyncio


class Quoter(Async_Fetcher):
    def __init__(self) -> None:
        pass

    def quote_trip(self, coords: list) -> float:
        reqs = {}

        for fr, to in zip(coords[:-1], coords[1:]):
            reqs[(tuple(fr), tuple(to))
                 ] = f"{OSRM_URL}/route/v1/car/{fr[0]},{fr[1]};{to[0]},{to[1]}"

        # print(reqs)

        # print(reqs)
        res = asyncio.run(self.make_requests_dist(reqs))

        return sum([x for x in res.values()])

    def quote_route(self, route: dict) -> float:
        reqs = {}

        for x in route.values():
            for fr, to in zip(x[:-1], x[1:]):
                reqs[(tuple(fr), tuple(to))
                     ] = f"{OSRM_URL}/route/v1/car/{fr['lon']},{fr['lat']};{to['lon']},{to['lat']}"

        # print(reqs)

        # print(reqs)
        res = asyncio.run(self.make_requests_dist(reqs))

        return sum([x for x in res.values()])


# if __name__ == "__main__":
#     q = Quoter()

#     print(q.quote([
#         [14.45672, 45.333034],
#         [14.453776, 45.333872],
#         [14.453354, 45.333345],
#         [14.453498, 45.33155],
#         [14.452046, 45.329568],
#         [14.449032, 45.328151]]
#     ))
