import type { THandler } from "../framework/index.ts";

export const get: THandler = async (_, response) => {
  return response.json({ message: "Hello World!", list: [1, 2, 3] });
};

export const post: THandler = async (_, response) => {
  return response.json({
    message: "You created the thing with the post",
    list: [1, 2, 3],
  });
};
