import express from "express";
require("express-async-errors");
import bodyParser = require("body-parser");
import { RedisClient } from "redis";
import { RedisStore } from "connect-redis";
import { response } from "./utils/response.util";
import { UserRouter } from "./Routers/user.router";
import { AuthRouter } from "./Routers/auth.router";
import { TeamRouter } from "./Routers/team.router";
import { BoardRouter } from "./Routers/board.router";
import { ListRouter } from "./Routers/list.router";
import { TaskRouter } from "./Routers/task.controller";
import { sessionAuthGuard } from "./middlewares/sessionAuthGuard.middleware";

const session = require("express-session");
const redis = require("redis");

const redisClient: RedisClient = redis.createClient({
  host: process.env.REDIS_HOST,
});
const redisStore: RedisStore = require("connect-redis")(session);

const app: express.Application = express();

// Enable cors requests
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.set("Access-Control-Allow-Origin", process.env.FRONTEND_HOST);
    res.set("Access-Control-Allow-Credentials", "true");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }
);

app.use(bodyParser.json());

// Setup express-session/redis
app.use(
  session({
    secret: process.env.REDIS_SECRETKEY,
    store: new redisStore({
      host: process.env.REDIS_HOST,
      port: 6379,
      client: redisClient,
      ttl: 600,
    }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/auth", AuthRouter);

app.use(sessionAuthGuard);
app.use("/user", UserRouter);
app.use("/team", TeamRouter);
app.use("/board", BoardRouter);
app.use("/list", ListRouter);
app.use("/task", TaskRouter);

// Error handling middlewares
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next({ statusCode: 404, message: "Endpoint not found" });
  }
);
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response => {
    console.log(error);
    return response(res, error.statusCode || 500, {
      message: `${error.message || "Something went wrong"}`,
    });
  }
);

export { app };
