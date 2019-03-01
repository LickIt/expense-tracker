#!/bin/bash

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
cd "$SCRIPT_DIR"

export FLASK_ENV=development
source venv/dev/bin/activate
flask run -h 0.0.0.0

