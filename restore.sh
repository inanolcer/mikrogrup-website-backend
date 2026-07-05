#!/bin/bash
set -e

echo "Strapi Test Database"
echo "USER  : " $POSTGRES_USER
echo "DB    : " $POSTGRES_DB

if [ $# -eq 0 ]; then
    echo "No parameters given! 
Usage: bash restore.sh [ restore |  drop | dump ]"
    exit 1
fi

if [ "$1" = "restore" ]; then
    echo "The database is empty. Restoring..."

    # Check if the database exists
    if ! psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$POSTGRES_DB"; then
        # Database does not exist. Creating...
        echo " Database does not exist. Creating..."
        psql -U "$POSTGRES_USER" -c "CREATE DATABASE $POSTGRES_DB"
    fi

    pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" /backup/db/kozmoz-strapi-latest.sql

fi

#echo "DB: $POSTGRES_DB already exists. Skipping restore."

# Drop database depending on sh params
if [ "$1" = "drop" ]; then

    echo "Dropping database..."
    psql -U "$POSTGRES_USER" -d "postgres" -c "DROP DATABASE \"$POSTGRES_DB\""

    psql -U "$POSTGRES_USER" -d "postgres" -c "CREATE DATABASE \"$POSTGRES_DB\""


fi

if [ "$1" = "dump" ]; then

    # mkdir "db-data"
    echo "Dumping  database..."
    # Get the current date in YYYY-MM-DD-HH-MM format
    CURRENT_DATE=$(date +%F-%H:%M)

    # Use the current date in the filename
    pg_dump -U "$POSTGRES_USER" -W -F t "$POSTGRES_DB" > ./backup/db/${NAMESPACE}-${CURRENT_DATE}.sql

fi

