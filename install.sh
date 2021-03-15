#!/bin/bash
npm run build
mkdir out/
cp -r dist out/
cp -r frontend out/
cp package.json out/
cp LICENSE out/
cd out/
npm install
npm run package
rm -r node_modules frontend package.json package-lock.json LICENSE dist
cd ../
