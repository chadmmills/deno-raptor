import getParams from "./get-params.ts";

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

type THandlerResponse = Promise<Response> | Response;

type TParams = Record<string, string>;

export type THandler = (
  requestData: { query: URLSearchParams; params: TParams; data: null },
  response: typeof Responder,
) => THandlerResponse;

export type THandlerModule = {
  [key in typeof httpMethods[number]]?: THandler;
};

export type TManifest = {
  find(url: string): null | { path: string; handlers: THandlerModule };
};

export default class RequestHandler {
  manifest: TManifest;

  constructor(manifestable: TManifest) {
    this.manifest = manifestable;
  }

  handle = async (req: Request) => {
    const httpMethod = req.method.toLowerCase();

    const route = this.manifest.find(req.url);

    if (!route) {
      return new Response("Not found", { status: 404 });
    }

    const routeHandler =
      route.handlers[httpMethod as keyof typeof route.handlers];

    if (routeHandler) {
      return await routeHandler({
        query: new URLSearchParams(req.url),
        params: getParams(new URL(req.url).pathname, route.path),
        data: null,
      }, Responder);
    }

    return new Response("Not found", { status: 404 });
  };
}
