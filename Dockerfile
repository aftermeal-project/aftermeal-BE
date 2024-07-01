FROM node:20-alpine AS staged
WORKDIR /opt/app

COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install", "--frozen-lockfile", "--non-interactive", "--production"]

COPY ["tsconfig.json", "tsconfig.build.json", "./"]
COPY ["nest-cli.json", "./"]
COPY ["src/", "./src/"]
RUN ["yarn", "build"]

RUN ["/bin/sh", "-c", "find . ! -name dist ! -name node_modules -maxdepth 1 -mindepth 1 -exec rm -rf {} \\\\;"]

FROM node:20-alpine AS completed
WORKDIR /opt/app
COPY --from=staged /opt/app ./

ENTRYPOINT ["yarn", "run", "start:prod"]
EXPOSE 3000
