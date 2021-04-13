#!/bin/bash


git pull
npm install
npm audit fix
cd frontend
npm install --legacy-peer-deps
npm audit fix
pm2 restart nft