install: package.json
	yarn install --pure-lockfile

run: install
	yarn run

dist: install $(wildcard src/**/*) $(wildcard src/*) $(wildcard *.json)
	yarn build

docker:
	docker build -t frontend -f docker/Dockerfile .

clean:
	yarn cache clean

.PHONY: install run clean docker