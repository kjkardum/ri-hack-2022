from socket import timeout
from networkx import DiGraph
from vrpy import VehicleRoutingProblem
import asyncio
import aiohttp
from aiohttp import ClientSession, ClientConnectorError
from pprint import pprint
import random

import time

import sys

OSRM_URL = "http://127.0.0.1:5001"

# vrp_fast = VehicleRoutingProblem(


class Vrp:
    def __init__(self, depot: tuple, stops: list, demands: list):
        self.depot = depot
        self.stops = [depot] + stops

        self.graph = DiGraph()

        self.init_graph_dists()

        for i, x in enumerate(demands):
            self.graph.nodes[i]["demand"] = x

        # self.graph.nodes[1]["demand"] = 5
        # self.graph.nodes[2]["demand"] = 4
        # self.graph.nodes[3]["demand"] = 7
        # self.graph.nodes[2]["demand"] = 4

        # pprint(res)
        # pprint(r)

        # pprint(r)

    def solve(self, num_vehicles: int, capacity: int):
        prob = VehicleRoutingProblem(
            self.graph, load_capacity=capacity, num_vehicles=num_vehicles)

        # prob.num_vehicles = 2
        prob.solve(time_limit=1)

        # print(self.stops)

        r = {}
        for k, v in prob.best_routes.items():
            r[k] = []

            for x in v:

                if x == "Sink":
                    r[k].append({"lon": self.depot[0], "lat": self.depot[1]})
                elif x == "Source":
                    r[k].append({"lon": self.depot[0], "lat": self.depot[1]})
                else:
                    r[k].append({"lon": self.stops[x][0],
                                "lat": self.stops[x][1]})

        for k, v in r.items():
            d = {}
            for i, (fr, to) in enumerate(zip(v[:-1], v[1:])):
                d[i] = OSRM_URL + \
                    f"/route/v1/car/{fr['lon']},{fr['lat']};{to['lon']},{to['lat']}?geometries=geojson"
                # (x["lon"], x["lat"])

            # pprint(d)
            res = asyncio.run(self.make_requests_route(d))

            for i, points in res.items():

                v[i]["geojson"] = points

        return r

    def init_graph_dists(self):

        reqs = {}

        for y in range(len(self.stops)):
            for x in range(len(self.stops)):
                reqs[(x, y)] =\
                    OSRM_URL + \
                    f"/route/v1/car/{self.stops[x][0]},{self.stops[x][1]};{self.stops[y][0]},{self.stops[y][1]}"

        assert sys.version_info >= (3, 7)

        # print(reqs)
        res = asyncio.run(self.make_requests_dist(urls=reqs))

        # pprint(res)

        for x in range(len(self.stops) - 1):
            self.graph.add_edge(
                "Source",  x, cost=res[(0,  1+x)])

            self.graph.add_edge(
                x, "Sink", cost=res[(1+x, 0)])

        for x in range(len(self.stops) - 1):
            for y in range(len(self.stops) - 1):
                self.graph.add_edge(
                    x, y, cost=res[(1+x, 1+y)])

    async def fetch_html(self, url: str, session: ClientSession, key: tuple) -> tuple:
        try:
            resp = await session.request(method="GET", url=url)
        except ClientConnectorError:
            return (url, 404, key)

        res = await resp.json()
        dist = 0
        for leg in res["routes"][0]["legs"]:
            dist += leg["distance"]

        return (resp.status, key, dist, res["routes"][0]["geometry"])

    async def make_requests_dist(self, urls: dict) -> list:
        # print(urls)
        async with ClientSession() as session:
            tasks = []
            for key, url in urls.items():
                tasks.append(
                    self.fetch_html(url=url, session=session, key=key)
                )
            results = await asyncio.gather(*tasks)

        return {x[1]: x[2] for x in results}

    async def make_requests_route(self, urls: dict) -> list:
        # print(urls)
        async with ClientSession() as session:
            tasks = []
            for key, url in urls.items():
                tasks.append(
                    self.fetch_html(url=url, session=session, key=key)
                )
            results = await asyncio.gather(*tasks)

        return {x[1]: x[3]["coordinates"] for x in results}


# if __name__ == "__main__":

#     stops = []

#     for x in range(10):
#         stops.append((14.4268 + random.random() / 1000,
#                      45.3358 + random.random() / 1000))

#     v = Vrp(depot=(14.4185, 45.3415),
#             stops=stops,
#             demands=[(x, random.randint(1, 10)) for x in range(len(stops))])

#     res = v.solve(10, 50)

#     pprint(res)
