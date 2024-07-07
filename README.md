<p align="center">
  <a href="https://aftermeal.online/" target="blank"><img src="https://github.com/sikhoo0/sikhoo0-server/assets/68471917/408b9f89-d0dd-44e7-969a-e10737f764e3" width="200" alt="sikhoo0 Logo" /></a>
</p>
<p align="center">교내 식후 활동 관리 서비스입니다.</p>
    <p align="center">

[![Build and Test](https://github.com/after-meal/aftermeal-BE/actions/workflows/build-and-test.yml/badge.svg?branch=main)](https://github.com/after-meal/aftermeal-BE/actions/workflows/build-and-test.yml)
[![Deploy](https://github.com/after-meal/aftermeal-BE/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/after-meal/aftermeal-BE/actions/workflows/deploy.yml)

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
$ docker compose up -d
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

# Architecture

![에프터밀_구조도-서버 구조도 drawio](https://github.com/after-meal/aftermeal-BE/assets/68471917/01b7db96-069d-4681-8937-f33ad00504ea)

