#!/bin/bash

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ../docker/server.key \
    -out ../docker/server.crt \
    -subj "/C=FR/ST=Anywhere/L=Here/O=Dev/CN=localhost"
