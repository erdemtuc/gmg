import "server-only";
import pino, { Bindings, DestinationStream, Logger as PinoLogger } from "pino";
import pretty from "pino-pretty";
import { APP_ENV, isLocal } from "@/config/env";

export type Logger = PinoLogger;

const level = process.env.LOG_LEVEL ?? (isLocal ? "debug" : "info");

// Use in-process pretty stream locally (no worker) to avoid Next worker bundling issues
const destination: DestinationStream | undefined = isLocal
  ? pretty({
      colorize: true,
      levelFirst: true,
      translateTime: "SYS:standard",
      singleLine: false,
      hideObject: false,
      ignore: "pid,hostname",
    })
  : undefined;

const logger = pino(
  {
    level,
    base: { app: "gomago-crm-web", env: APP_ENV },
    redact: {
      paths: [
        "req.headers.authorization",
        "headers.authorization",
        "authorization",
        "password",
        "token",
        "access_token",
        "refresh_token",
        "*.token",
        "*.password",
      ],
      remove: true,
    },
  },
  destination,
);

export function getLogger(bindings?: Bindings): Logger {
  return bindings ? logger.child(bindings) : logger;
}
