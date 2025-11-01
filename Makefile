.PHONY: migrate seed

migrate:
	docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

seed:
	docker compose exec backend php bin/console doctrine:database:drop --force || true
	docker compose exec backend php bin/console doctrine:database:create
	docker compose exec backend php bin/console doctrine:migrations:migrate -n
	docker compose exec backend php bin/console doctrine:fixtures:load -n