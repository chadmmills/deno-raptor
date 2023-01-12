import { assert, runner } from "./test.ts";

import RequestHandler from "./request-handler.ts";

runner.test("Not find a module for the route", async () => {
  const manifest = {
    find: () => null,
  };

  const requestHandler = new RequestHandler(manifest);

  const response = await requestHandler.handle(
    new Request("http://localhost:3000"),
  );

  assert.equals(response.status, 404);
});

// it should file a module for the route and call the get method
runner.test("Find a module for the route and call the get method", async () => {
  const manifest = {
    find: () => ({
      post: async () => new Response("ok", { status: 202 }),
    }),
  };

  const requestHandler = new RequestHandler(manifest);

  const response = await requestHandler.handle(
    new Request("http://localhost:3000", { method: "POST" }),
  );

  assert.equals(response.status, 202);
});
