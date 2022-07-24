from pulp import *
import random
from geopy.distance import great_circle

from functools import lru_cache


class Optimizer:
    def __init__(self, buildings: list):
        self.buildings = buildings

    def dist_multiplier(self, dist: float) -> float:
        "Falloff function for distance"

        return 1 / (1 + dist / 100)

    def optimize(self, candidates: list, max_number: int):
        """
        Returns optimal coordinates to place containers when given coords
        """

        prob = LpProblem("Waste_Problem")

        choices = LpVariable.dicts(
            "Choice", (range(len(candidates))), cat="Binary")

        # max number of candidates to take
        prob += lpSum([choices[i]
                      for i in range(len(candidates))]) <= max_number

        LAE = LpAffineExpression()

        for i, c in enumerate(candidates):
            for b in self.buildings:
                # print(c, b)
                LAE += b["rating"] * \
                    self.dist_multiplier(great_circle(
                        c, (b["lat"], b["lon"])
                    ).m) * choices[i]

        prob += -LAE

        prob.solve(pulp.PULP_CBC_CMD(timeLimit=2, msg=0))

        return [candidates[x] for x in choices if choices[x].value() >= 0.5]

    @lru_cache(maxsize=32)
    def optimize_anywhere(self, max_number: int):
        """
        Returns optimal coordinates to place containers anywhere
        """

        candidates = random.sample(
            [(x["lat"], x["lon"]) for x in self.buildings], 500)  # workaround

        # print(len(candidates))

        prob = LpProblem("Waste_Problem")

        choices = LpVariable.dicts(
            "Choice", (range(len(candidates))), cat="Binary")

        # max number of candidates to take
        prob += lpSum([choices[i]
                      for i in range(len(candidates))]) <= max_number

        LAE = LpAffineExpression()

        for i, c in enumerate(candidates):
            for b in self.buildings:
                # print(c, b)
                LAE += b["rating"] * \
                    self.dist_multiplier(great_circle(
                        c, (b["lat"], b["lon"])
                    ).m) * choices[i]

        prob += -LAE

        prob.solve(pulp.PULP_CBC_CMD(timeLimit=2, msg=0))

        return [candidates[x] for x in choices if choices[x].value() >= 0.5]
