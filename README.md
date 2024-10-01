<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  
</p>

## Run Postgres docker container
```bash
docker run -d --name nestjs -p 5436:5432 -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v <YOUR_LOCAL_PATH>:/var/lib/postgresql/data postgres:15.4
```
  
<b> `YOUR_LOCAL_PATH` ==> please replace this line to your local path where you want to mount postgres data </b>

## Run Elastic Database and Kibana


```bash
docker-compose -f elastic-compose up -d
```

# Installation
  
```bash
yarn  
```
## Running the app

### Running on the terminal

```bash
# development
$ yarn run dev

```
### Create a production build

```bash
# development
$ yarn run build

```
## RUNNING WITH DOCKER
### Run production server

```bash
# development
$ yarn run start:prod

```
### Access the docker instance
``` bash
# Server is running at 

http://localhost:8080/

# Kibana
http://localhost:5601/

```
### Run with docker

```
docker-compose up -d
```

### Stop docker

```
docker-compose down
```
## License

Nest is [MIT licensed](LICENSE).
  

