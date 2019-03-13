#!/bin/sh

cd /etc/nginx

# add server name
echo "server_name ${SERVER_NAME};" > server_name.txt

# add ssl certificates
echo "ssl_certificate       ${SSL_CERTIFICATE};" > ssl_certificates.txt
echo "ssl_certificate_key   ${SSL_CERTIFICATE_KEY};" >> ssl_certificates.txt

exec "$@"