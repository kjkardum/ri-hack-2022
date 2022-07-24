import asyncio
from aiohttp import ClientSession, ClientConnectorError

OSRM_URL = "http://localhost:5001"


class Async_Fetcher:
    def __init__(self):
        pass

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

        # print(results)

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
