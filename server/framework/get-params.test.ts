import { assert, runner } from "./test.ts";

import getParams from "./get-params.ts";

runner.test("Should return an empty object if there are no params", () => {
  assert.equals(getParams("/ok", "/ok"), {});
});

runner.test("Should return an object with one param", () => {
  assert.equals(getParams("/ok/nice/then", "/ok/$this/then"), { this: "nice" });
});

runner.test("Should return an object with two params", () => {
  assert.equals(getParams("/ok/nice/then/other", "/ok/$this/then/$now"), {
    this: "nice",
    now: "other",
  });
});
