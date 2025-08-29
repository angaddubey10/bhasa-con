-- Database initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- You can add any initial database setup here
-- For example, create additional users, databases, or initial data

-- The main tables will be created by Alembic migrations
