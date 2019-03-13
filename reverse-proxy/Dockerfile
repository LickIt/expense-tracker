FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /

ENV SERVER_NAME="localhost"
ENV SSL_CERTIFICATE="/etc/nginx/cert/fullchain.pem"
ENV SSL_CERTIFICATE_KEY="/etc/nginx/cert/privkey.pem"

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]