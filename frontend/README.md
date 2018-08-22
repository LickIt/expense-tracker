## Description

Angular 6 project that uses the material theme and `chart.js` for charting.

## Development

### Pre-requisites
* Install `nodejs`. Instructions for [Debian/Ubuntu](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

* Install `@angular/cli`:
```bash
sudo npm install -g @angular/cli
```

### Start

```bash
yarn install --pure-lockfile
yarn start
```

## Production

* Make a build
```bash
yarn build
cd dist
tar -cvzf expense-tracker-<version>.tgz *
```

* Nginx configuration

```
server {
	listen 		80;
	#server_name 	localhost;
	index		index.html;

	location / {
		alias /<expense-tracker>/frontend/;
		try_files $uri $uri/ /index.html;
	}
}
```
