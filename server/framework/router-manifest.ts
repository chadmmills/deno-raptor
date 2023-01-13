import type { THandlerModule, TManifest } from "./request-handler.ts";
import pathLookup from "./path-lookup.ts";

export type TRouteMap = Record<string, THandlerModule>;

export default class RouterManifest implements TManifest {
  routes: TRouteMap;

  constructor(routeMap: TRouteMap) {
    this.routes = routeMap;
  }

  find(
    url: string,
    lookup: (path: string, pathKeys: string[]) => string | null = pathLookup,
  ): { path: string; handlers: THandlerModule } | null {
    const pathKey = lookup(new URL(url).pathname, Object.keys(this.routes));

    if (!pathKey) {
      return null;
    }

    const handlers = this.routes[pathKey];

    if (!handlers) {
      return null;
    }

    return { path: pathKey, handlers };
  }
}
