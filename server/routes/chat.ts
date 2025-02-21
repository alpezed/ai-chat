import { Hono } from "hono";
import { createChat, deleteChat, updateChatTitle } from "../controllers/chat";
import { sessionMiddleware } from "@/server/middleware/session";
import type { AuthSession } from "@/server/types/session";

const app = new Hono<{ Variables: AuthSession }>()
  .post("/", sessionMiddleware, createChat)
  .put("/chat-title", sessionMiddleware, updateChatTitle)
  .delete("/:chatId", deleteChat);

export default app;
