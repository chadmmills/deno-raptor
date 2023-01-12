import type { TManifest, TMethodHandler } from "./request-handler.ts";
import pathLookup from "./path-lookup.ts";

export type TRouteMap = { [key: string]: TMethodHandler };

export default class RouterManifest implements TManifest {
  routes: TRouteMap;

  constructor(routeMap: TRouteMap) {
    this.routes = routeMap;
  }

  find(
    url: string,
    lookup: (path: string, pathKeys: string[]) => string | null = pathLookup,
  ) {
    const pathKey = lookup(new URL(url).pathname, Object.keys(this.routes));

    if (!pathKey) {
      return null;
    }

    return this.routes[pathKey] || null;
  }
}
