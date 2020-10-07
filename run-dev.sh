#!/bin/bash

export NODE_ENV=development

# Load environment variables from .env file
set -o allexport
source .env
set +o allexport

./migration-run.sh
concurrently --kill-others-on-fail "cd server && nodemon" "rescripts start"
