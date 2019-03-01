## Description

API for managing expenses written in python. Uses `flask` for REST queries and `sqlalchemy` for ORM.

## Development

* Install `venv` and create an environment with:
```bash
python3 -m venv venv/dev
source venv/dev/bin/activate
```
_You may need the `python3.6-dev` package installed for the `uwsgi` server._

* Run the flask application with
```bash
make run
```

## Production

To run in production behind nginx:
* Start uwsgi (preferably as a service)

```bash
source venv/dev/bin/activate

uwsgi --ini util/uwsgi.ini
```

## Creating users

You can only create users from within the local deployment environment.

### Development

```bash
curl -X POST -H "Content-Type: application/json" -d '{ "username": "<user>", "password": "<password>", "role": "user" }' http://127.0.0.1:5000/api/users
```

### Production

```bash
docker exec -it <container> curl -X POST -H "Content-Type: application/json" -d '{ "username": "<user>", "password": "<password>", "role": "user" }' http://127.0.0.1/api/users
```