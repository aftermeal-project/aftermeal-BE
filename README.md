<p align="center">
  <img src="https://github.com/sikhoo0/sikhoo0-server/assets/68471917/408b9f89-d0dd-44e7-969a-e10737f764e3" width="200" alt="sikhoo0 Logo" />
</p>
<p align="center">
    교내 식후 활동 관리 서비스입니다.
</p>

# How to Start
## Set up Node.js
```bash
$ nvm install
$ nvm use
```

## Installation

```bash
$ yarn install
```

## Set up Database

```bash
$ docker compose -f compose.local.yml up -d --wait
$ yarn run schema:sync
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# integration tests
$ yarn run test:integration

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
