## Description

API for managing expenses written in python. Uses `flask` for REST queries and `sqlalchemy` for ORM.

## Running

Install `pipenv` and create an environment with `pipenv install`.

Start postgres database. Example in docker container:
```
docker run --name expense-tracker-db \
    -p 5432:5432 \
    -e POSTGRES_DB=expense-tracker \
    -d postgres
```

Run the flask application with `./run.sh`.