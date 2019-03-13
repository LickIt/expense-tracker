FROM node as build

WORKDIR /src
COPY . .

RUN npm ci
RUN npm run-script build

FROM nginx:alpine

COPY --from=build /src/dist/ /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /

ENV API_URL=http://localhost:5000/api

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]