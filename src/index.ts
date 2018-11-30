import { ConnectionContext } from "./interface";

import {
  subscribeOnRedis,
  createConnectionContext,
  runningServer
} from "./connection";

import { registerRestHandler } from "./controller";

const context: ConnectionContext = createConnectionContext();

subscribeOnRedis(context);
registerRestHandler(context);
runningServer(context);
