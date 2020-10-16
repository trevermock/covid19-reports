#!/bin/bash

rescripts build
mkdir ./build/public
mv ./build/*.* ./build/public
mv ./build/static ./build/public/static

tsc --project ./server
mv ./server/build/* ./build
mkdir ./build/api/roster/uploads
