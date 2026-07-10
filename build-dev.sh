#!/bin/bash
clear 

#Check if docker is running
if ! docker info &>/dev/null; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

action="$1"

mode="$2"
# if second parameter is not set default to "dev"
if [ -z "$mode" ]; then
    mode="-dev"
fi


# Check if the first parameter to this script is "build"  else default to up
if [ "$action" == "fresh" ]; then
    echo "Compose fresh BUILD and UP..."
    docker compose -f docker-compose"$mode".yml build --no-cache
    docker compose -f docker-compose"$mode".yml down --remove-orphans 
    docker compose -f docker-compose"$mode".yml up -d 
else
    echo "Compose UP..."
    # docker-compose -f docker-compose.yml down  
    docker compose -f docker-compose"$mode".yml down
    docker compose -f docker-compose"$mode".yml up -d 
fi  


# Check if all services are up and running
echo "Checking if all services are up and running..."


services=("teamsystem-strapi-api")


for service in "${services[@]}"
do
    state=$(docker inspect --format '{{.State.Status}}' $service)
    if [ "$state" == "running" ]; then
        echo " ✔ $service is up and running"
    elif [ "$state" == "restarting" ]; then
        echo " X $service is restarting"
    else
        echo " X $service is not running"
    fi
done
