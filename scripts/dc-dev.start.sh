#!/bin/sh

docker-compose -f docker-compose.dev.yml down --remove-orphans;
echo 'Removed old containers'
docker-compose -f docker-compose.dev.yml up -Vd;
echo 'All services are running'


