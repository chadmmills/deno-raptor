import { crypto } from "https://deno.land/std@0.173.0/crypto/mod.ts";

import { db } from "./lib.ts"

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string | null;
  complted_at: string | null;
}

type User = {
  id: number | null;
  name: string;
  created_at: string | null;
}

const ORM = {
  todos: {
    all: () => db.prepare("SELECT * FROM todos;").all<Todo>(),
      find: (id: string) => db.prepare("SELECT * FROM todos WHERE id = ? LIMIT 1;").get<Todo>(id),
      findAll: (searchParams: Partial<Todo>) => {
      const keys = Object.keys(searchParams);
      const values = Object.values(searchParams);
      const query = `SELECT * FROM todos WHERE ${keys.map((key) => `${key} = ?`).join(" AND ")}`;
      return db.prepare(query).all<Todo>(...values);
    },
    create: (input: Omit<Partial<Todo>, "id" | "created_at">) => {
      const data = { ...input, id: crypto.randomUUID()};
      const keys = Object.keys(data);
      const values = Object.values(data);
      const query = `INSERT INTO todos (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
      const result = db.prepare(query).run(...values);
      console.info("Rows inserted:", result);
      return ORM.todos.find(data.id);
    },
  },
  users: {
    all: () => db.prepare("SELECT * FROM users;").all<User>(),
      find: (id: string) => db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1;").get<User>(id),
      findAll: (searchParams: Partial<User>) => {
      const keys = Object.keys(searchParams);
      const values = Object.values(searchParams);
      const query = `SELECT * FROM users WHERE ${keys.map((key) => `${key} = ?`).join(" AND ")}`;
      return db.prepare(query).all<User>(...values);
    },
    create: (input: Omit<Partial<User>, "id" | "created_at">) => {
      const data = { ...input, id: crypto.randomUUID()};
      const keys = Object.keys(data);
      const values = Object.values(data);
      const query = `INSERT INTO users (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
      const result = db.prepare(query).run(...values);
      console.info("Rows inserted:", result);
      return ORM.users.find(data.id);
    },
  },
}

export { ORM };