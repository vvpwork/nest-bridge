#!/bin/sh

docker-compose -f docker-compose.local.yml down --remove-orphans;
echo 'Removed old containers'
docker-compose -f docker-compose.local.yml up -Vd;
echo 'All services are running'


