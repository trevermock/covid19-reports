#!/bin/bash

export NODE_ENV=development

./build_dev.sh
node ./build/app.js
