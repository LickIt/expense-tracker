FROM python:3-alpine as build

WORKDIR /install
RUN apk add --no-cache postgresql-dev gcc musl-dev linux-headers
COPY venv/prod-requirements.txt requirements.txt

RUN pip install --no-binary :all --install-option="--prefix=/install" -r requirements.txt

FROM python:3-alpine

WORKDIR /usr/src/expense-tracker

COPY --from=build /install /usr/local
COPY docker/uwsgi.ini .
COPY app.py .
COPY src src

RUN apk add --no-cache postgresql-libs
RUN python -m compileall .

EXPOSE 80
ENV DB_CONNECTION="postgresql://username:password@localhost/mydatabase"

CMD [ "uwsgi", "--ini", "uwsgi.ini"]