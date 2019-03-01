build: frontend backend docker

frontend:
	$(MAKE) -C frontend

backend:
	$(MAKE) -C backend

reverse-proxy:
	$(MAKE) -C reverse-proxy

docker:
	$(MAKE) -C frontend docker
	$(MAKE) -C backend docker
	$(MAKE) -C reverse-proxy docker

.PHONY: build frontend backend reverse-proxy docker