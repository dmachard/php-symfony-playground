# php-symfony-playground

A Symfony playground

- Frontend : https://localhost/app
- API Symfony : https://localhost/api
- API Swagger : https://localhost/api/docs
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

# Check if all containers are running
docker compose ps
auth            8080/tcp, 9000/tcp, 0.0.0.0:8443->8443/tcp, [::]:8443->8443/tcp
backend_php     9000/tcp
backend_web     0.0.0.0:80->80/tcp, [::]:80->80/tcp
database        3306/tcp, 33060/tcp

# Init PHP backend dependancies
docker compose exec backend composer install
# Init database
docker compose exec backend php bin/console doctrine:schema:update --force

```