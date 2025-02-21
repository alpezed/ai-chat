import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = c.get("session");

  const isAuthenticated = !!session;

  if (c.req.path === "/sign-in" || c.req.path === "/sign-up") {
    return next();
  }

  if (!isAuthenticated) {
    return c.redirect("/sign-in");
  }

  await next();
});

export const unAuthMiddleware = createMiddleware(async (c, next) => {
  const session = c.get("session");
  if (!!session) {
    return c.redirect("/");
  }
  await next();
});
