#!/bin/bash -e
# Detect when it is running in kubernetes containers and use the ip command instead
if [ ! -f "/sbin/ifconfig" ]; then
  HOST_IP=$(ip addr | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1 | awk -F '/' '{ print $1 }')
else
  HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
fi

PROJECT_NAME="shop-test-db"
export HOST_IP
export DB_HOST=localhost
export DB_NAME=tests
export DB_USERNAME=prisma
export DB_PASSWORD=prisma

 
find_container_id() {
  docker ps \
    --filter "status=running" \
    --filter "label=osh.project=${PROJECT_NAME}" \
    --filter "label=com.docker.compose.service=$1" \
    --no-trunc \
    -q
}

check_database() {
  docker exec \
    "${DB_CONTAINER_ID}" \
    bash -c "PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -U ${DB_USERNAME} -d ${DB_NAME} -c 'select 1'"
}

wait_for_database() {
  local host="${DB_HOST}"
  local port=5433
  local connectionTimeout=3
  local databaseTimeout=30

  echo -e "Waiting for database connection \"${host}:${port}\" 1s ${connectionTimeout}x"
  until echo > /dev/tcp/"$host"/"$port" || [ $connectionTimeout -eq 0 ]; do
    ((connectionTimeout--))
    sleep 1
  done

  if [ $connectionTimeout -eq 0 ]; then
    echo -e "Failed to acquire database connection"
    return 1
  fi

  echo -e "Connection acquired"

  echo -e "Waiting for the database to be ready"
  until check_database > /dev/null 2>&1 || [ $databaseTimeout -eq 0 ]; do
    ((databaseTimeout--))
    sleep 1
  done

  if [ $databaseTimeout -eq 0 ]; then
    echo -e "Failure to wait for the database, it took to long to boot"
    return 1
  fi

  echo -e "Database ready"
  return 0
}

start_db_container() {
    echo "Starting db container"
    docker-compose run -d --label osh.project="${PROJECT_NAME}" -e POSTGRES_DB="${DB_NAME}" -e POSTGRES_USER="${DB_USERNAME}" -e POSTGRES_PASSWORD="${DB_PASSWORD}" -p 5430:5432 database
}

# Find and kill existing containers
DB_CONTAINER_ID=$(find_container_id database)
ALL_CONTAINERS="$DB_CONTAINER_ID"
HAS_CONTAINERS="$(echo -e "${ALL_CONTAINERS}" | tr -d '[:space:]')"

if [ -n "${HAS_CONTAINERS}" ]; then
  docker kill "${ALL_CONTAINERS}"
fi

# DATABASE
start_db_container
DB_CONTAINER_ID=$(find_container_id database)
wait_for_database
yarn db:migrate:test