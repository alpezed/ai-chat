import { Hono } from "hono";
import { createChat, deleteChat, updateChatTitle } from "../controllers/chat";

const app = new Hono()
  .post("/chat-title", updateChatTitle)
  .post("/", createChat)
  .delete("/:chatId", deleteChat);

export default app;
