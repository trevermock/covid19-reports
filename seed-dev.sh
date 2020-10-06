#!/bin/bash

export NODE_ENV=development
export SYNC_DATABASE=true
export SQL_HOST=${SQL_HOST:=localhost}
export SQL_PORT=${SQL_PORT:=5432}
export SQL_USER=${SQL_USER:=postgres}
export SQL_PASSWORD=${SQL_PASSWORD:=postgres}
export SQL_DATABASE=${SQL_DATABASE:=dds}
export PGPASSWORD=$SQL_PASSWORD

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

read -r -p "Are you sure? This will delete existing data in your local '$SQL_DATABASE' database. [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])
        if [ "$( psql -tAc "SELECT 1 FROM pg_database WHERE datname='$SQL_DATABASE'" -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" )" = '1' ]; then
          dropdb -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" "$SQL_DATABASE" || { echo "Failed to drop '$SQL_DATABASE' database. You may still have an open connection."; exit; }
          echo "Dropped existing '$SQL_DATABASE' database"
        fi

        createdb -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER" "$SQL_DATABASE" || { echo "Failed to create '$SQL_DATABASE' database."; exit; }
        echo "Created '$SQL_DATABASE' database"

        ts-node --project "$DIR/server/tsconfig.json" "$DIR/server/sqldb/seed-dev.ts"
        ;;
    *)
        echo "Aborted"
        ;;
esac
