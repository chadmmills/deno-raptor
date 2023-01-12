import type { THandler } from "../framework/index.ts";

export const get: THandler = (_, response) => {
  return response.json({ root: true });
};
