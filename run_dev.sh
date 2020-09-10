#!/bin/bash

export NODE_ENV=development

concurrently --kill-others-on-fail "cd server && nodemon" "rescripts start"
