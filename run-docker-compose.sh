#!/bin/bash

# Name of the network
network_name="peterkapena"

# Check if the network exists
network_exists=$(docker network ls --filter name=^${network_name}$ --format="{{ .Name }}")

if [ -z "$network_exists" ]; then
  echo "Network $network_name does not exist, creating..."
  docker network create $network_name
else
  echo "Network $network_name already exists."
fi

# Now run docker-compose
docker-compose up -d
