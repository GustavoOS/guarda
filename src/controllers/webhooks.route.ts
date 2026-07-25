import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import handleSeaweedWebhook from "../services/seaweed";
import { seaweedWebhookSchema } from "./webhooks.schema";

export const webhooksController = new Hono()
.post("/seaweedfs", sValidator("json", seaweedWebhookSchema), async (c) => {
    const body = c.req.valid("json");
    console.log("SeaweedFS webhook:", body);
    handleSeaweedWebhook(body);    
    return c.json({ message: "Webhook received" });
});

export default webhooksController;
