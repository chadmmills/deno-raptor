import { assert, runner } from "./test.ts";

import RouterManifest from "./router-manifest.ts";

runner.test("Not find a route for the url", () => {
  const routeMap = {};

  const manifest = new RouterManifest(routeMap);

  assert.equals(manifest.find("http://localhost:3001"), null);
});

runner.test("Should find a route for the url", () => {
  const routeMap = {
    "/": {
      get: async () => new Response("ok", { status: 200 }),
    },
  };

  const manifest = new RouterManifest(routeMap);

  assert.equals(manifest.find("http://localhost:3001"), routeMap["/"]);
});
