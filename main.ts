import { Hono } from "jsr:@hono/hono";
import document from "./routes/documents.ts";
const app = new Hono();

console.log('starting')

app.get("/", (c) => c.text("Hello, World!"));
app.route('/documents', document);
Deno.serve(app.fetch);

