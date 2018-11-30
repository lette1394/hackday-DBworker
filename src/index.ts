import { ConnectionContext } from "./interface";

import {
  subscribeOnRedis,
  getConnectionContext,
  runningServer
} from "./connection";

import { registerRestHandler } from "./controller";

const context: ConnectionContext = getConnectionContext();

subscribeOnRedis(context);
registerRestHandler(context);

runningServer(context);
