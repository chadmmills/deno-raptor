import type { THandler } from "../../../framework/index.ts";

export const get: THandler = async (_, db, response) => {
  return response.json(
    db.todos.all()
  )
}

export const post: THandler = async ({ data }, db, response) => {
  console.log(data);
  if (!data) {
    return response.json({ error: "No data provided" }, 400);
  }

  const todo = db.todos.create(data);
  return response.json(todo);
}
