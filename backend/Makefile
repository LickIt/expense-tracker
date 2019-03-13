venv/dev: $(wildcard venv/*-requirements.txt)
	python3 -m venv venv/dev
	. venv/dev/bin/activate && pip install wheel
	. venv/dev/bin/activate && pip install -r venv/dev-requirements.txt

venv/prod: venv/prod-requirements.txt
	python3 -m venv venv/prod
	. venv/prod/bin/activate && pip install wheel
	. venv/prod/bin/activate && pip install -r venv/prod-requirements.txt

run: venv/dev
	. venv/dev/bin/activate && export FLASK_ENV=development && flask run -h 0.0.0.0

docker:
	docker build -t backend -f docker/Dockerfile .

clean:
	rm -rf venv/dev
	rm -rf venv/prod

.PHONY: docker run clean