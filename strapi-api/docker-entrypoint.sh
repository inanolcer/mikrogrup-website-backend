#!/bin/sh
set -e

echo "🚀 Starting Strapi in $NODE_ENV mode"
echo "📊 Database connection details:"
echo "  DATABASE_CLIENT: $DATABASE_CLIENT"
echo "  DATABASE_HOST: $DATABASE_HOST"
echo "  DATABASE_PORT: $DATABASE_PORT"
echo "  DATABASE_NAME: $DATABASE_NAME"
echo "  DATABASE_USERNAME: [HIDDEN]"
echo "  DATABASE_SSL: $DATABASE_SSL"
echo "  DATABASE_SSL_REJECT_UNAUTHORIZED: $DATABASE_SSL_REJECT_UNAUTHORIZED"
echo "  DATABASE_POOL_MIN: $DATABASE_POOL_MIN"
echo "  DATABASE_POOL_MAX: $DATABASE_POOL_MAX"

# Test database connection before starting
if [ "$DATABASE_CLIENT" = "postgres" ]; then
  echo "🔌 Testing PostgreSQL connection to $DATABASE_HOST:$DATABASE_PORT..."
  timeout 10 sh -c "until nc -z $DATABASE_HOST $DATABASE_PORT; do echo 'Waiting for PostgreSQL...'; sleep 1; done" || echo "⚠️  Warning: Could not connect to PostgreSQL, but continuing anyway."
fi

echo "📝 Checking for required node modules..."
if [ ! -d "/srv/app/node_modules/@strapi/strapi" ]; then
  echo "⚠️  Warning: @strapi/strapi module not found, running yarn install..."
  yarn install --production
fi

# Execute the passed command
echo "✨ Executing: $@"
exec "$@" 