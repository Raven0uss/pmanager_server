# pmanager_server

My name is Sofiane BELAZOUZ and this project is my assignement test.
The API is used with a client on [this repository](https://github.com/Raven0uss/pmanager_client).

You can find here the [API Documentation](https://documenter.getpostman.com/view/25903745/2s93CLstxx) of this project generated with [Postman](https://www.postman.com/).

## How to start the project ?

You cloned the project ? Perfect. Now, go to the directory and launch the multi-container of this API.

```bash
cd pmanager_server
docker-compose up --build
```

There is two services :
  - pmanager_server: This is based on the `Dockerfile` at the root of the project. It basically uses an image node `node:14-alpine3.13`, install the packages and expose our server on port 8080.
  - pmanager_db: This is the PostgreSQL image of our project.
  
Everything is online, and you should see `# PManager listening on port 8080` which means server is ON.

You can also check if everything is up with this command :
```bash
docker ps
```
You will have something like that.
```
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS          PORTS                    NAMES
b8e74fe5d489   pmanager-server        "docker-entrypoint.s…"   15 seconds ago   Up 14 seconds   0.0.0.0:8080->8080/tcp   pmanager_server
cd94f32b0381   postgres:14.1-alpine   "docker-entrypoint.s…"   15 seconds ago   Up 14 seconds   0.0.0.0:5432->5432/tcp   pmanager_db
```

You can also check and manage your containers and images with [Docker Desktop](https://www.docker.com/products/docker-desktop/) which provide an UI.

## How to run the tests ?

First check your local version of node : 
```bash
node --version
```

If your version is `< v14.0.0` you can update your node version with [nvm](https://github.com/nvm-sh/nvm) which is my recommandation for a version manager of Node. Follow the guidance to install it and then launch the following command to have the last stable version available. 

```bash
nvm install --lts
nvm use --lts
```

Then you can install the node packages localy to run the tests.
```bash
npm i
```

Run the tests :
```bash
npm run test
```

The suit test create also a `lcov-report` which contain the detailed report of the coverage. You can launch it with this command :
```
npm run test:report
```

You can access by clicking on the local server provided by `http-server`.
