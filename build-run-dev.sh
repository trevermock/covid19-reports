#!/bin/bash

export NODE_ENV=development

./build-dev.sh
node ./build/app.js
