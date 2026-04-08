.PHONY: dev prod down

dev:
	ENVIRONMENT=develop docker compose up --build

prod:
	ENVIRONMENT=production docker compose up --build -d

down:
	docker compose down -v
