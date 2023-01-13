import type { THandler } from "../../../framework/index.ts";

export const get: THandler = ({ params }, responder) => {
  return responder.json({ message: `Hey ${params.name}!` });
};
