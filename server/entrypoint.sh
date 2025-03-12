#!/bin/sh

echo "Running migrations..."
npx knex migrate:latest

echo "Starting application..."
exec node dist/index.js
