FROM python:3.12-slim

WORKDIR /app

COPY /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "gunicorn --workers=4 --bind 0.0.0.0:$PORT wsgi:app"]