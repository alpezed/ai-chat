import chatRoutes from "./chat";

export const routes = [chatRoutes] as const;

export type AppType = (typeof routes)[number];
