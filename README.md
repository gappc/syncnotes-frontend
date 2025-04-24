# syncnotes

Implement simple note taking app with sync functionality using [yjs](https://github.com/yjs/yjs) and [y-websocket](https://github.com/yjs/y-websocket).

## WebSocket server

This project uses a simple WebSocket server to handle the communication between clients.

To start the server, run the following command (you need to have nodejs installed):

```bash
YPERSISTENCE=./dbDir HOST=0.0.0.0 PORT=1234 npx y-websocket
```

Using `HOST=0.0.0.0`, the server binds to all network interfaces. Given the `POST=1234` setting, you can connect to to the server on localhost e.g. at `ws://localhost:1234`.

Note that the `YPERSISTENCE` environment variable is used to specify the directory where the server should store the data. If you don't specify this variable, the server will store the data in memory and you will lose all data when you restart the server.

## Client

The client is a simple Vue app that uses `yjs` packages to connect to the server and handle state changes.

To start the client, run the following command:

```bash
npm run dev
```

This will start the client on `http://localhost:5137`.

## Usage

- Open the client in multiple tabs or browsers.
- Add notes in one tab and see them appear in the other tabs.
- Edit notes in one tab and see the changes appear in the other tabs.
- Delete notes in one tab and see the changes appear in the other tabs.
