.PHONY: server

## Run server and db
server:
	docker network create --driver bridge full-stack-net || true;
	cd server;
	docker run \
	--name mysql-db \
	--network full-stack-net \
	-p 3306:3306 \
	-e MYSQL_ROOT_PASSWORD=root \
	-e MYSQL_ROOT_HOST=% \
	--volume ~/.full-stack-app/mysql:/var/lib/mysql
	-d \
	mysql:9;
## remove this root user/password in future - insecure method
	sleep 20;
	docker exec -i mysql-db sh -c 'exec mysql -uroot -p"root"' < ./server/init.sql;
	sleep 20;
	docker run \
	-d \
	--network full-stack-net \
	--name full-stack-backend \
	-p 8000:8000 \
	full-stack-backend;

## Build the server image
build-server:
	cd server && docker build -t full-stack-backend .;

## Run the UI
ui:
	docker network create --driver bridge full-stack-net || true;
	cd client;
	docker run \
	--network full-stack-net \
	--name full-stack-frontend \
	-p 3000:3000 \
	-d \
	full-stack-frontend;

## Build the UI image
build-ui:
	cd client && docker build -t full-stack-frontend .;

# Build the app
build-app:
	docker-compose -f install/docker/docker-compose.yml build;

# Run the app
app:
	docker-compose -f install/docker/docker-compose.yml down;
	docker-compose -f install/docker/docker-compose.yml up;