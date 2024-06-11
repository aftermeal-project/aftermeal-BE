FROM node:20-alpine as staged
WORKDIR /opt/app

COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install"]

COPY ["tsconfig.json", "tsconfig.build.json", "./"]
COPY ["nest-cli.json", "./"]
COPY ["src/", "./src/"]
RUN ["yarn", "build"]

FROM node:20-alpine as completed
WORKDIR /opt/app
COPY --from=staged /opt/app ./
ENTRYPOINT ["node", "dist/main"]
EXPOSE 3000
