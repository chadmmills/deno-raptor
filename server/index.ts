import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

const httpMethods = ["get", "post", "patch", "delete"] as const;

type THandle = (query: null, params: null, data: null) => null;

type TMethodHandler = {
  [key in typeof httpMethods[number]]?: THandle;
};

type TManifest = {
  find(url: string): null | TMethodHandler;
};

class RouterManifest implements TManifest {
  routes = [];

  constructor() {
    this.routes = [];
  }

  find() {
    return null;
  }
}

class RouterHandler {
  manifest: TManifest;

  constructor(manifest: TManifest) {
    this.manifest = manifest;
  }

  handle(req: Request) {
    const httpMethod = req.method.toLowerCase();

    let route;
    const routerHandler = this.manifest.find(req.url);

    if (!routerHandler) {
      return new Response("Not found", { status: 404 });
    }

    if (httpMethod === "get") {
      route = routerHandler.get;
    }

    if (httpMethod === "post") {
      route = routerHandler.post;
    }
    if (httpMethod === "patch") {
      route = routerHandler.patch;
    }
    if (httpMethod === "delete") {
      route = routerHandler.delete;
    }

    return route?.(null, null, null) ||
      new Response("Not found", { status: 404 });
  }
  // RouterHandler is responsible for finder the right handler for a given request
  // from the provided manifest
}

const handler = new RouterHandler(new RouterManifest());

await serve(handler.handle, { port: 8000 });
