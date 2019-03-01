#!/bin/sh

cd /usr/share/nginx/html

# replace API url
sed -i 's|apiUrl:"[^"]*"|apiUrl:"'"$API_URL"'"|' main.*.js

exec "$@"