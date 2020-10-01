#!/bin/bash

rescripts build
mkdir ./build/public
mv ./build/*.* ./build/public
mv ./build/static ./build/public/static

tsc --project ./server
mv ./server/build/* ./build
mkdir ./build/api/roster/uploads
cp ./server/api/roster/uploads/roster-template.csv ./build/api/roster/uploads/roster-template.csv
