#!/bin/bash

export NODE_ENV=production

./migration-run.sh
node ./build/app.js
