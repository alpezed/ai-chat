import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

import chatRoutes from "./routes/chat";
import viewRoutes from "./routes/views";
import { auth } from "@/lib/auth";

const app = new Hono();

app.use(logger());
app.use("/static/*", serveStatic({ root: "../" }));

app.route("/", viewRoutes);

app.on(["POST", "GET"], "/api/auth/**", c => auth.handler(c.req.raw));
const routes = app.route("/api/v1/chat", chatRoutes);

export default app;
export type AppType = typeof routes;
