export const APP_ENV =
  process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? "local";
export const isLocal = APP_ENV === "local";
