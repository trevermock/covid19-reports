#!/bin/bash

export NODE_ENV=development
export HTTPS=true

concurrently --kill-others-on-fail "cd server && nodemon" "rescripts start"
