# Deno Server Timing Middleware

Implements `start(label: string)` and `end(label:string)` to trace timings of async operations. Results are concatenated into a [`Server-Timing` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing). 

### Getting started

```
import { createServerTimingMiddleware } from "https://deno.land/x/server_timing/mod.ts"

(...)

const { start, end, serverTimingMiddleware } = createServerTimingMiddleware()

(... in middleware)

start('fetch')
const dataFromDB = await getData()
end('fetch')

start('render')
const html = await render(dataFromDB)
end('render')

response.html = html
```

### Test local example

`denon oak`

`curl 127.0.0.1:8080 --verbose`


```
~ curl 127.0.0.1:8080 --verbose
*   Trying 127.0.0.1:8080...
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
> GET / HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/7.77.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< content-type: text/plain; charset=utf-8
< server-timing: fetch;dur=702, render;dur=202,
< content-length: 2
< date: Mon, 14 Feb 2022 19:37:05 GMT
<
* Connection #0 to host 127.0.0.1 left intact
ok%
```

In Chrome, you can access Network tab for server timing details on each request:

![Chrome Server Timing Header Screenshot](/public/server-timing.png)
