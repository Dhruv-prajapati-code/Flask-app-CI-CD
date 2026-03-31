FROM python:3-slim AS build

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get -y install --no-install-recommends

RUN pip install --no-cache-dir  -r requirements.txt --target /app/libraries

COPY . .


FROM python:3-slim AS final

WORKDIR /app

COPY --from=build /app/libraries /app/libraries
COPY --from=build /app .

ENV PYTHONPATH="/app/libraries"

CMD ["python", "app.py"]