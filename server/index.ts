import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

import RequestHandler from "./framework/request-handler.ts";
import RouterManifest from "./framework/router-manifest.ts";
import RouterMap from "./framework/router-map.ts";
import { requestTime } from "./framework/middleware.ts";

import type { TMethodHandler } from "./framework/request-handler.ts";

const routerMap = await new RouterMap("./server/routes").load<TMethodHandler>();

const handler = new RequestHandler(new RouterManifest(routerMap));

await serve(requestTime(handler.handle), { port: 8000 });
