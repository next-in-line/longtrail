#!/bin/bash
psql -U postgres -d "longtrail_test" -c "
    drop schema public cascade;
    create schema public;
    create extension ltree;
"
npx knex migrate:latest --env test