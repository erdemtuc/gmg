"use client";

type Level = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

const levelOrder: Record<Level, number> = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
  silent: 100,
};

const currentLevel: Level =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as Level) || "info";

function shouldLog(target: Level) {
  return levelOrder[target] >= levelOrder[currentLevel];
}

export const clientLogger = {
  error: (...args: unknown[]) => shouldLog("error") && console.error(...args),
  warn: (...args: unknown[]) => shouldLog("warn") && console.warn(...args),
  info: (...args: unknown[]) => shouldLog("info") && console.info(...args),
  debug: (...args: unknown[]) => shouldLog("debug") && console.debug(...args),
  trace: (...args: unknown[]) => shouldLog("trace") && console.trace(...args),
};
