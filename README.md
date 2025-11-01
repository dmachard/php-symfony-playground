# php-symfony-playground

# 🧩 PHP Symfony Playground

A full-featured **Symfony playground** with authentication, role management, and frontend integration.

## 🚀 Overview

| Service | URL | Description |
|----------|-----|-------------|
| **Frontend** | [https://localhost:3000](https://localhost:3000) | React/Next.js frontend (client app) |
| **Symfony API** | [https://localhost:9443/api](https://localhost:9443/api) | Main backend API |
| **Swagger Docs** | [https://localhost:9443/api/docs](https://localhost:9443/api/docs) | OpenAPI documentation for the Symfony API |
| **Keycloak Admin Console** | [https://localhost:8443](https://localhost:8443) | Identity and access management (SSO, roles, users) |

## 👥 Default Users

| Username | Password | Role | Description |
|-----------|-----------|------|-------------|
| **admin** | `admin` | Keycloak admin | Access the Keycloak admin console |
| **alice** | `alice` | `ROLE_USER` | Standard user |
| **bob** | `bob` | `ROLE_USER` | Standard user |
| **god** | `god` | `ROLE_ADMIN` | Administrator user |

> **Note:** User accounts are managed through Keycloak and automatically seeded during environment setup.
> - Realm: playground
> - Client: api_symfony
> - Roles: ROLE_USER, ROLE_ADMIN

## 🏁 Quick Start

Clone the repository and execute the following commands

```bash
# Generate cert for HTTPS
./scripts/generate-certs.sh

# Start the environment
docker-compose up --build

# Init Keycloak
./scripts/import-keycloak.sh
# Tester Keycloak via Nginx
curl -k https://localhost:8443/realms/playground/.well-known/openid-configuration

# Init PHP backend dependancies and database model
docker compose exec backend composer install
docker compose exec backend php bin/console doctrine:schema:update --force
```