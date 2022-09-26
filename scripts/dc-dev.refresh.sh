#!/bin/sh


echo 'rebuild api and worker'
docker-compose -f docker-compose.dev.yml up -Vd --no-deps --build api worker
echo 'Api and worker is running services are running'