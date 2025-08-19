# SETUP
```
> cp .env.example .env
```

# BUILD App
```
> docker compose build
```

# RUN Migration
```
# start app [detached]
$host> docker compose up -d

# enter into the container shell
$host> docker exec -it nestjs-stack_api

# run migration in container shell
/app# npm run migration:run
```

# RUN
```
> docker compose up
```

# TESTS
```bash
# spin up test DB
docker-compose -f docker-compose.test.yml up -d

# then
cd api
npm run test:e2e
```