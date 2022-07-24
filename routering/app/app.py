from flask import Flask, request, jsonify
import json
from streql import equals
from optimizer import Optimizer
from vrp import Vrp
from quoter import Quoter

import os

from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

app = Flask(__name__)

optimizer = Optimizer(json.load(open("data/buildings.json")))


@app.route("/containters_anywhere/<int:max_number>", methods=["GET"])
def containters_anywhere(max_number):

    key = request.args.get("API_KEY")

    if not key or not equals(key, os.environ["API_KEY"]):
        return jsonify([])

    return jsonify(optimizer.optimize_anywhere(int(max_number)))


@app.route("/containters_candidates/<int:max_number>", methods=["GET"])
def containters_candidates(max_number):

    candidates = request.json

    print(candidates)

    key = request.args.get("API_KEY")

    if not key or not equals(key, os.environ["API_KEY"]):
        return jsonify({})

    return jsonify(optimizer.optimize(candidates, int(max_number)))


@app.route("/vrp/<int:num_drivers>/<int:capacity>", methods=["GET"])
def vrp(num_drivers: int, capacity: int):

    req = request.json

    key = request.args.get("API_KEY")

    if not key or not equals(key, os.environ["API_KEY"]):
        return jsonify({})

    vrp = Vrp(req["depot"], req["stops"], req["demands"])

    res = vrp.solve(num_drivers, capacity)

    return jsonify(res.values())


@app.route("/quote_trip", methods=["GET"])
def quote_trip():
    req = request.json

    key = request.args.get("API_KEY")

    if not key or not equals(key, os.environ["API_KEY"]):
        return jsonify({})

    q = Quoter()

    return jsonify({"total_dist": q.quote_trip(req)})


@app.route("/quote_total", methods=["GET"])
def quote_total():
    req = request.json

    key = request.args.get("API_KEY")

    if not key or not equals(key, os.environ["API_KEY"]):
        return jsonify({})

    q = Quoter()

    return jsonify({"total_dist": q.quote_route(req)})


if __name__ == "__main__":
    app.run()

    # o = Optimizer(json.load(open("data/buildings.json")))

    # print(o.optimize_anywhere(10))

    # print(o.optimize_anywhere(10))

    # print(o.optimize_anywhere(10))
    # print(o.optimize_anywhere(10))

    # print(o.optimize_anywhere.cache_info())
