import {
  Application,
  Router,
} from "https://deno.land/x/oak/mod.ts";

import {
  delay
} from "https://deno.land/std@0.125.0/async/delay.ts";

import { createServerTimingMiddleware } from '../mod.ts'

const PORT = 8080;
const { start, end, serverTimingMiddleware } = createServerTimingMiddleware({log: true})

// Create an oak Application
const app = new Application();
app.use(serverTimingMiddleware)

// Create an oak Router
const router = new Router();

// Handle main route
router.get("/", async (context) => {
  console.log(">>>", context.request.url.pathname);
  
  start('fetch')
  await delay(700);
  end('fetch')

  start('render')
  await delay(200) 
  context.response.body = "ok"
  end('render')
});

app.use(router.routes());
app.use(router.allowedMethods());

// Log hello
app.addEventListener("listen", () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// Start server
await app.listen({ port: PORT });
