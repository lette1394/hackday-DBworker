import * as express from "express";
import * as http from "http";
import * as io from "socket.io";
import { Server, Socket } from "socket.io";

const PORT: Number = 9000;
const app: express.Express = express();
const server: http.Server = http.createServer(app);

app.get("/login", (req, res) => {
  console.log("db worker");
});

server.listen(
  PORT,
  (): void => {
    console.log("Server listening at port %d", PORT);
  }
);
