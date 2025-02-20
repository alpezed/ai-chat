import { Hono } from "hono";
import { createChat, updateChatTitle } from "../controllers/chat";

const app = new Hono()
  .post("/chat-title", updateChatTitle)
  .post("/", createChat);

export default app;
