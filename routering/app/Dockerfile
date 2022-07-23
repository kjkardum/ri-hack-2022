FROM python:3.9-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ENV API_KEY=123

ENTRYPOINT [ \
    "gunicorn", "app:app", \
    "-w", "2", \
    "--threads", "2", \
    "-b", "0.0.0.0:5000" ]