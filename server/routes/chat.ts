import { Hono } from "hono";
import { createChat, deleteChat, updateChatTitle } from "../controllers/chat";

const app = new Hono()
  .post("/", createChat)
  .put("/chat-title", updateChatTitle)
  .delete("/:chatId", deleteChat);

export default app;
