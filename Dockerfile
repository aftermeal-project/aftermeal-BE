FROM node:20-alpine AS build
WORKDIR /opt/app

COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install", "--frozen-lockfile", "--non-interactive", "--production"]

COPY ["tsconfig.json", "tsconfig.build.json", "./"]
COPY ["nest-cli.json", "./"]
COPY ["src/", "./src/"]
RUN ["yarn", "build"]

FROM node:20-alpine AS completed
WORKDIR /opt/app

COPY --from=build ["/opt/app/dist", "./dist"]
COPY --from=build ["/opt/app/node_modules", "./node_modules"]

ENTRYPOINT ["node", "dist/main"]