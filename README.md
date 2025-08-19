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
## Using the app
- Get access_token with existing (seeded) user
```
# Over HTTP
POST /auth/login
{
    "email": "amanze@example.com",
    "password": "changeme"
}
```
- Or create a new User
```
# Over HTTP
POST /auth/register
{
    "email": "someone-else@example.com",
    "password": "changeme",
    "firstName": 'Human',
    "lastName": 'Being',
    "phone": '555-555-5555'
}
```

# TESTS
```bash
# spin up test DB
docker-compose -f docker-compose.test.yml up -d

# then
cd api
npm run test:e2e
```