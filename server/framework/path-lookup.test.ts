import { asserEquals, runner } from "./test.ts";

import pathLookup from "./path-lookup.ts";

runner.test("match a basic url path with a router path", () => {
  asserEquals(pathLookup("/foo", ["/foo"]), "/foo");
})

runner.test("should match a url path with a router path with a trailing slash", () => {
  asserEquals(pathLookup("/foo/", ["/foo"]), "/foo");
})

runner.test("should match a url path with a router path with param", () => {
  asserEquals(pathLookup("/foo/123", ["/foo/:id"]), "/foo/:id");
})
