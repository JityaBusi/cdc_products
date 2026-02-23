#!/bin/bash

curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "products-connector",
    "config": {
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "database.hostname": "postgres",
      "database.port": "5432",
      "database.user": "user",
      "database.password": "password",
      "database.dbname": "products_db",
      "database.server.name": "pg-server",
      "table.include.list": "public.products",
      "plugin.name": "pgoutput",
      "tombstones.on.delete": "true"
    }
  }'