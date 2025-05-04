# syncnotes

Implement simple note taking app with sync functionality using [yjs](https://github.com/yjs/yjs) and [y-websocket](https://github.com/yjs/y-websocket).

## Table of Contents

- [Installation](#installation)
- [Docker](#docker)
- [Environment variables](#environment-variables)
- [WebSocket server](#websocket-server)

## Installation

```bash
#Clone the repository and navigate to the project directory:
git clone

# Change to the project directory
cd syncnotes-frontend

# Install dependencies
npm install

# Start the client
npm run dev
```

## Docker

You can run the frontend in a Docker container. To do this, you need to have Docker installed.

To build the Docker image, run the following command:

```bash
docker build -t gappc/syncnotes-frontend .
```

To run the Docker container, run the following command:

```bash
docker run -p 8080:80 syncnotes
```

This will start the client on `http://localhost:8080`.

You can also run the frontend with Docker Compose. To do this, you need to have Docker and Docker Compose installed.
To build the Docker image, run the following command:

```bash
docker-compose build
```

To run the Docker container, you should first create a `compose.override.yml` file to specify the ports the frontend will be accessible at. You can use the file [compose.override.yml.example](./compose.override.yml.example) as a template, which uses port 80. Then, run the following command:

```bash
docker-compose up
```

This will start the client on `http://localhost`.

## Environment variables

You should create a `.env` file in the root directory of the project to specify the environment variables. You can use the file [.env.example](./.env.example) as a template.

The following environment variables are used in the project:

- `VITE_WEBSOCKET_URL`: The URL of the WebSocket server. This is used to connect to the server.

## WebSocket server

This project provides a simple WebSocket server to be used as example.

To start the server, you need to have the `y-websocket` and `@y/websocket-server` packages installed (see [package.json](./package.json). The `@y/websocket-server` package can be installed as dev dependency.

Then, run the following command (you need to have nodejs installed):

```bash
YPERSISTENCE=./dbDir HOST=0.0.0.0 PORT=1234 npx y-websocket
```

Using `HOST=0.0.0.0`, the server binds to all network interfaces. Given the `POST=1234` setting, you can connect to to the server on localhost e.g. at `ws://localhost:1234`.

Note that the `YPERSISTENCE` environment variable is used to specify the directory where the server should store the data. If you don't specify this variable, the server will store the data in memory and you will lose all data when you restart the server.
