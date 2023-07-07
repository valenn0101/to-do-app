-- CREATE DATABASE IF NOT EXISTS dockerdb
SELECT 'CREATE DATABASE dockerdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dockerdb')\gexec