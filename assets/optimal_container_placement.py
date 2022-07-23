from pulp import *
import json
from geopy.distance import great_circle
from pprint import pprint


def dist_multiplier(dist: float) -> float:
    return 1 / (1 + dist / 100)


if __name__ == "__main__":

    # pprint(json.load(open("buildings.json")))

    buildings = json.load(open("buildings.json"))
    candidates = [(45.3281236, 14.4695382),
                  (45.32832736, 14.4895382),
                  (45.32212736, 14.4695882),
                  (45.32812366, 14.46958382),
                  (45.32812376, 14.46953482),
                  (45.32818236, 14.46953682),
                  (45.32817236, 14.46956382),
                  (45.328162836, 14.46958382),
                  (45.32812836, 14.46953782),
                  (45.32812836, 14.46957382),
                  (45.32812736, 14.46953882),
                  (45.32814236, 14.46954382),
                  ]
    max_number = 3

    prob = LpProblem("Waste_Problem")

    choices = LpVariable.dicts(
        "Choice", (range(len(candidates))), cat="Binary")

    # max number of candidates to take
    prob += lpSum([choices[i] for i in range(len(candidates))]) <= max_number

    LAE = LpAffineExpression()

    for i, c in enumerate(candidates):
        for b in buildings:
            # print(c, b)
            LAE += b["rating"] * \
                dist_multiplier(great_circle(
                    c, (b["lat"], b["lon"])
                ).m) * choices[i]

    prob += -LAE

    prob.solve(pulp.PULP_CBC_CMD(timeLimit=2, msg=0))

    return [candidates[x] for x in choices if choices[x].value() >= 0.5]

    # print(dist_multiplier(200))

    # x = bbox[2]-bbox[0]
    # y = bbox[3]-bbox[1]

    # _x = x / DIM
    # _y = y / DIM

    # print(_x, _y)
