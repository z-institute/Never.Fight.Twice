#!/bin/bash

npm install
npm audit fix
cd frontend
npm install --legacy-peer-deps
npm audit fix
pm2 start --name nft npm -- start