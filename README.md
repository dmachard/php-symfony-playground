# php-symfony-playground

A Symfony playground
- Frontend : https://localhost:3000
- API Symfony : https://localhost:9443/api
- API Swagger : https://localhost:9443/api/docs
- Admin Keycloak : https://localhost:8443/

default users
- admin/admin for keycloak
- alice and bob for the main app (user role)
- god for the main app (admin role)

```bash
# Generate cert for HTTPS
./scripts/generate-certs.sh

# Start the stack
docker-compose up -d

# Init Keycloak
./scripts/import-keycloak.sh
# Tester Keycloak via Nginx
curl -k https://localhost:8443/realms/playground/.well-known/openid-configuration

# Init PHP backend dependancies and database model
docker compose exec backend composer install
docker compose exec backend php bin/console doctrine:schema:update --force
```