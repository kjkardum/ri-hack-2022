from flask import Flask, request, jsonify
import openai
import os
from streql import equals
from flask_cors import CORS, cross_origin

# openai.organization = "Personal"
openai.api_key = os.getenv("OPENAI_API_KEY")


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

context = """
RiCycle je napredna aplikacija namjenjena odvozu otpada u Rijeci.
Koristi napredne algoritme planiranja ruta i rasporeda otpada.
Postavlja kontejnere za otpad ovisno o gustoći naseljenosti.
Ja sam robot namjenjen odgovaranju na upite korisnika pogonjen openAI gpt-3 transformer mrežom.
"""

question = "Kada će biti smeće pokupljeno kod mene?"


@app.route("/chat", methods=["POST"])
@cross_origin()
def chat():

    key = request.args.get("API_KEY")

    # print(key, os.environ["API_KEY"])

    if not key or not equals(key, os.environ["API_KEY"]):
        return jsonify([])

    # print(request)

    req = request.json["params"]

    print(req)

    # start_sequence = "\nA:"
    # restart_sequence = "\n\nQ: "

    if req["prev_question_and_answers"]:
        prev_convo = "".join(["Q: " + x[0] + "\n" +
                              "A: " + x[1] + "\n\n" for x in req["prev_question_and_answers"]])
    else:
        prev_convo = ""

    # print()
    # return jsonify({})

    query = context + "\n" + prev_convo + "Q: " + req["question"] + "\nA:"

    # print(query)

    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=query,
        temperature=0,
        max_tokens=100,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=["\n"]
    )

    # print(response)

    if response.choices[0].text == "":
        return jsonify({"repose": "Nemam odgovor na tvoje pitanje :("})

    return jsonify({"response": response.choices[0].text})

    # return jsonify({})


if __name__ == "__main__":
    app.run(port=5002)

#     print()

# print(os.getenv("OPENAI_API_KEY"))

# print(openai.Model.list())

# openai.Answer.create()

# app.run()
