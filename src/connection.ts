import * as redis from "redis";
import * as mysql from "mysql";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";

import { Notification } from "./interface/Notification";
import { ConnectionContext, User } from "./interface";

import {
  REDIS_HOST,
  REDIS_PORT,
  EVENT_NOTIFICATION,
  PORT,
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_CHARSET,
  DB_DATABASE,
  REDIS_MESSAGE
} from "./constants";
import { importanceResolver } from "./helper";
import { handler } from "./handler";

export const createConnectionContext = (): ConnectionContext => {
  const app: express.Express = express();
  app.use(cors());
  app.use(bodyParser.json());
  const server: http.Server = http.createServer(app);

  const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  });

  const dbConn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    charset: DB_CHARSET,
    database: DB_DATABASE
  });

  return {
    redisClient,
    dbConn,
    server,
    app
  };
};

export const runningServer = ({ server }) =>
  server.listen(
    PORT,
    (): void => {
      console.log("Server listening at port %d", PORT);
    }
  );

export const subscribeOnRedis = ({
  redisClient,
  dbConn
}: ConnectionContext) => {
  redisClient.on(REDIS_MESSAGE, handler.redisMessageHandler({ dbConn }));

  redisClient.subscribe(EVENT_NOTIFICATION);
};
