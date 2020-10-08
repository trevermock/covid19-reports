#!/bin/bash

export NODE_ENV=development

# Load environment variables from .env file
set -o allexport
source .env
set +o allexport

./build-dev.sh
./migration-run.sh
node ./build/app.js
