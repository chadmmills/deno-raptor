import { assert, runner } from "./test.ts";

import RouterMap from "./router-map.ts";

runner.test("RouterMap", async () => {
  const walker = async (_path: string) => [{ path: "/test.ts" }];

  const routerMap = new RouterMap(".", walker);

  const importer = async (path: string) => "imported test";

  const result = await routerMap.load<string>("lol", importer);

  assert.equals(result, { "/test": "imported test" });
});
