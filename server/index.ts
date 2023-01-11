import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

import RequestHandler from "./framework/request-handler.ts";
import RouterManifest from "./framework/router-manifest.ts";

const handler = new RequestHandler(new RouterManifest());

await serve(handler.handle, { port: 8000 });
