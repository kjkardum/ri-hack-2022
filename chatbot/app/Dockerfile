FROM python:3.9-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ARG API_KEY=123

# SIKE! DODATI OPEN_AI API
ARG OPENAI_API_KEY=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

RUN echo "API_KEY=$API_KEY\nOPENAI_API_KEY=$OPENAI_API_KEY\n" > .env

ENTRYPOINT [ \
    "gunicorn", "app:app", \
    "-w", "2", \
    "--threads", "2", \
    "-b", "0.0.0.0:5002" ]