import { assert, runner } from "./test.ts";

import pathLookup from "./path-lookup.ts";

runner.test("should match root path", () => {
  assert.equals(pathLookup("/", ["/"]), "/");
})

runner.test("match a basic url path with a router path", () => {
  assert.equals(pathLookup("/foo", ["/foo"]), "/foo");
})

runner.test("should match a url path with a router path with a trailing slash", () => {
  assert.equals(pathLookup("/foo/", ["/foo"]), "/foo");
})

runner.test("should match a url path with a router path with param", () => {
  assert.equals(pathLookup("/foo/123", ["/foo/:id"]), "/foo/:id");
})
