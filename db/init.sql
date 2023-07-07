-- CREATE DATABASE IF NOT EXISTS postgresdb
SELECT 'CREATE DATABASE postgresdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'postgresdb')\gexec