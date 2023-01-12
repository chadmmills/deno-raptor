const Responder = {
  json: (data: unknown) => {
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export type TResponder = typeof Responder;

const httpMethods = ["get", "post", "patch", "delete"] as const;

// type TResponse = typeof Response;
type THandlerResponse = Promise<Response>;
export type THandler = (
  requestData: { query: URLSearchParams; params: null; data: null },
  response: typeof Responder,
) => THandlerResponse;

export type TMethodHandler = {
  [key in typeof httpMethods[number]]?: THandler;
};

export type TManifest = {
  find(url: string): null | TMethodHandler;
};

export default class RequestHandler {
  manifest: TManifest;

  constructor(manifestable: TManifest) {
    this.manifest = manifestable;
  }

  handle = async (req: Request) => {
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

    if (route) {
      return await route({
        query: new URLSearchParams(req.url),
        params: null,
        data: null,
      }, Responder);
    }

    return new Response("Not found", { status: 404 });
  };
}
