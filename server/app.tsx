import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import chatRoutes from "./routes/chat";
import viewRoutes from "./routes/views";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "../" }));

app.route("/", viewRoutes);

const routes = app.route("/api/v1/chat", chatRoutes);

export default app;
export type AppType = typeof routes;
