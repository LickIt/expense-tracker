## Description

API for managing expenses written in python. Uses `flask` for REST queries and `sqlalchemy` for ORM.

## Development

* Install `pipenv` and create an environment with:
```bash
PIPENV_VENV_IN_PROJECT=true pipenv install
```
_You may need the `python3.6-dev` package installed for the `uwsgi` server._

* Run the flask application with
```bash
./run.sh
```

## Production

To run in production behind nginx:
* Start uwsgi (preferably as a service)

```bash
pipenv run uwsgi --ini util/uwsgi.ini --uid www-data --gid www-data --daemonize /var/log/uwsgi.log
```

* Nginx configuration

```
server {
	listen 		80;
	#server_name 	localhost;

	location /api { try_files $uri @app; }
	location @app {
        include		uwsgi_params;
        uwsgi_pass	unix:/<expense-tracker>/backend/expense-tracker-api.sock;
    }
}
```
