#!/bin/bash

git fetch
oldcommit=$(git rev-parse --short HEAD )
newcommit=$(git rev-parse --short FETCH_HEAD )
if [ $oldcommit = $newcommit ]
then
        echo "no update"
        exit
fi
echo "update"
git pull
npm install
npm audit fix
cd frontend
npm install --legacy-peer-deps
npm audit fix
pm2 restart nft