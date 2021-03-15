#!/bin/bash
npm run build
mkdir out/
cp -r dist out/
cp -r frontend out/
cp -r node_modules out/
cp package.json out/
cp LICENSE out/
cd out/
npm run package
rm -r node_modules frontend package.json LICENSE dist
mv YouTubeMusicDesktop* YouTubeMusicDesktop
cd ../
cp res/* out/YouTubeMusicDesktop
